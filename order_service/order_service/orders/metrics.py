from opentelemetry import metrics

# Create a meter for your service
meter = metrics.get_meter("order-service")

order_count = meter.create_counter(
    name="orders_total",
    unit="1",
    description="Total number of orders"
)

order_revenue = meter.create_counter(
    name="orders_revenue_total",
    unit="INR",
    description="Total revenue from orders"
)
