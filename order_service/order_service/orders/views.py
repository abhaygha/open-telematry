from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Order, OrderItem, Payment, OrderAddress
from .serializers import OrderSerializer, PaymentSerializer
from .helper import get_cart_details, delete_cart

import logging
from opentelemetry import trace
from opentelemetry.trace import get_current_span
from opentelemetry.trace.status import Status, StatusCode
from opentelemetry.baggage import get_baggage
from .metrics import order_count, order_revenue

tracer = trace.get_tracer(__name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class CreateOrderView(APIView):
    def post(self, request):
        user_id = request.data['customer_id']
        email = request.data['customer_email']
        method = request.data['method']
        address = request.data['address']

        transaction_id = get_baggage("transaction_id") or "unknown"
        with tracer.start_as_current_span("create _order") as span:

            span.set_attribute("email", email)
            span.set_attribute("user_id", user_id)
            span.set_attribute("method", method)
            span.set_attribute("transaction_id", transaction_id)
            logger.info(f"processing Order for transaction_id {transaction_id} ",
                        exc_info={"trace_id": span.get_span_context().trace_id})

        cart_detail = get_cart_details(user_id)

        
        cart_items = cart_detail['results']

        if not cart_detail['results']:
            logger.error(f"Cart is Empty. transaction_id {transaction_id} ",
                    exc_info={"trace_id": span.get_span_context().trace_id})
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        

        
        orders = []
        with transaction.atomic():

            for cart_item in cart_items:
                total_price = cart_detail['total']['total']
                order = Order.objects.create(
                    customer_id=user_id,
                    customer_email = email,
                    subtotal=cart_detail['total']['subtotal'],
                    shipping_price=cart_detail['total']['shipping_price'],
                    subscription_discount=cart_detail['total']['subscription_discount'],
                    total_price=total_price,
                    method=method,
                )
                logger.error(f"Order created with ID: {order.id}. transaction_id {transaction_id} ",
                    exc_info={"trace_id": span.get_span_context().trace_id})

                orders.append(order.id)

                OrderItem.objects.create(
                    order=order,
                    product_name=cart_item['name'],
                    quantity=cart_item['quantity'],
                    price_per_item=cart_item['price'],
                    image=cart_item['images'][0],
                    product_id=cart_item['id'],
                    size=cart_item['size'],
                )

                OrderAddress.objects.create(
                    order=order, **address)
                
                order_revenue.add(
                    total_price,
                    attributes={
                        "amount": total_price,
                        "payment_mode": method,
                        "product_name": cart_item['name'],
                    }
                )

                order_count.add(
                    1,
                    attributes={
                        "payment_mode": method,
                        "region": "north"
                    }
                )
            
            response = delete_cart(user_id)
            if response != True:
                logger.error(f"Unable to delete cart. transaction_id {transaction_id} ",
                    exc_info={"trace_id": span.get_span_context().trace_id})
                raise Response({"message": "Unable to delete Cart"}, status=status.HTTP_400_BAD_REQUEST)
            logger.error(f"Deleted cart. transaction_id {transaction_id} ",
                    exc_info={"trace_id": span.get_span_context().trace_id})

        return Response({"message": "Success", "orders": orders}, status=status.HTTP_201_CREATED)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer_id=self.kwargs.get('customer_id')).order_by('-id')

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'id'


class CreatePaymentView(APIView):
    def post(self, request):
        order_ids = request.data.get("order_ids")

        for order_id in order_ids:
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

            if order.status == "completed":
                continue

            order = Order.objects.get(id=order_id)
            order.method = "stripe"
            order.payment_status = "completed"
            order.save()

            Payment.objects.create(
                order=order,
                amount=order.total_price,
                status="completed",
                method="stripe"
            )

        return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
