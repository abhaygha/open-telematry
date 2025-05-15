from django.urls import path
from .views import CreateOrderView, OrderListView, OrderDetailView, CreatePaymentView

urlpatterns = [
    path('orders/<int:customer_id>/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
    path('update/orders/', CreatePaymentView.as_view(), name='update-order-detail'),
]
