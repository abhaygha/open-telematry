from opentelemetry import metrics

meter = metrics.get_meter("payment-service")

payment_request_counter = meter.create_counter(
    name="payment_requests_total",
    unit="1",
    description="Total number of payment requests"
)
