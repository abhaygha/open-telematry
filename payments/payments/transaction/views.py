import stripe
import logging
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Payment
from opentelemetry import trace
from opentelemetry.trace import get_current_span
from opentelemetry.trace.status import Status, StatusCode
from .metrics import payment_request_counter
from opentelemetry.baggage import get_baggage

tracer = trace.get_tracer(__name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

stripe.api_key = settings.STRIPE_SECRET_KEY

CURRENCY = "inr"

class StripeCheckoutSessionView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            payment_request_counter.add(1, {
                "http.method": request.method,
                "endpoint": request.path
            })

            span = get_current_span()

            product_name = request.data["product_name"]
            amount = request.data["amount"]
            order_ids = request.data["order_ids"]


            with tracer.start_as_current_span("make_payment") as span:
                transaction_id = get_baggage("transaction_id") or "unknown"

                span.set_attribute("product_name", product_name)
                span.set_attribute("amount", amount)
                span.set_attribute("currency", CURRENCY)
                span.set_attribute("transaction_id", transaction_id)

                logger.info(f"processing payment for transaction_id {transaction_id} ",
                            exc_info={"trace_id": span.get_span_context().trace_id})


            query_string = f"order_ids={','.join(map(str, order_ids))}"
            success_url = f"http://localhost:5173/payment/success?{query_string}"

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': CURRENCY,
                        'unit_amount': int(amount) * 100,
                        'product_data': {'name': product_name},
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url="http://localhost:5173/payment/cancel",
                metadata={},
            )

            for order_id in order_ids:
                Payment.objects.create(
                    order_id=order_id,
                    stripe_payment_intent=checkout_session.get("payment_intent"),
                    amount_paid=amount,
                    status="success",
                    payment_method_types=checkout_session.get("payment_method_types"),
                    payment_id=checkout_session.get("id"),
                )
                logger.info(f"Successfully Processed payment for transaction_id {transaction_id} ",
                                exc_info={"trace_id": span.get_span_context().trace_id})

            return Response({'sessionId': checkout_session.id})

        except Exception as e:
            span.record_exception(e)
            span.set_status(Status(StatusCode.ERROR))
            logger.error("payment failed", exc_info=e)
            return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = "your_stripe_webhook_secret"

    # 3delete
    amount = 100

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response({"error": "Invalid signature"}, status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session["metadata"].get("order_id")
        payment_intent = session.get("payment_intent")

        try:
            Payment.objects.create(
                order=order_id,
                stripe_payment_intent=payment_intent,
                stripe_charge_id=session.get("payment_intent"),
                amount_paid=amount,
                status="success"
            )
            print(f"Payment recorded for Order {order_id}")
        except:
            print("Order not found")

    return Response(status=200)
