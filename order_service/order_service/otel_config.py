import os
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import logging
from opentelemetry.instrumentation.django import DjangoInstrumentor

def setup_opentelemetry():
    # Define service resource
    resource = Resource(attributes={SERVICE_NAME: "Order-service"})

    # ---- Tracing Setup ----
    otlp_exporter = OTLPSpanExporter(
        endpoint="localhost:4319",
        insecure=True,
    )
    
    trace_provider = TracerProvider(resource=resource)
    trace_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
    trace.set_tracer_provider(trace_provider)

    # Example Log
    logger = logging.getLogger(__name__)
    logger.warning("This is a sample log message from Order Service")

    DjangoInstrumentor().instrument()

if __name__ == "__main__":
    setup_opentelemetry()
    # Example function that simulates an order operation
    import time
    from opentelemetry import trace

    def process_order_operation(order_id, operation):
        tracer = trace.get_tracer(__name__)
        with tracer.start_as_current_span("process_order_operation") as span:
            span.set_attribute("order_id", order_id)
            span.set_attribute("operation", operation)
            logging.info(f"Processing order operation {operation} for order {order_id}")
            time.sleep(1)  # Simulate processing time
            logging.info(f"Order operation {operation} processed for order {order_id}")
            return True

    # generate a trace
    process_order_operation("12345", "create")
    print("OpenTelemetry initialized and example trace generated. Make sure Jaeger is running locally!")
