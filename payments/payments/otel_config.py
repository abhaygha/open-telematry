import os
from opentelemetry import trace, metrics, _logs
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.propagate import set_global_textmap
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator
from opentelemetry.instrumentation.logging import LoggingInstrumentor
import logging
from opentelemetry._logs import set_logger_provider
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


def setup_opentelemetry():
    # Define service resource
    resource = Resource(attributes={SERVICE_NAME: "Payment-service"})

    # ---- Tracing Setup ----
    trace_exporter = OTLPSpanExporter(
        endpoint="http://localhost:4317",
        insecure=True
    )
    trace_provider = TracerProvider(resource=resource)
    trace_provider.add_span_processor(BatchSpanProcessor(trace_exporter))
    trace.set_tracer_provider(trace_provider)

    # ---- Metrics Setup ----
    metric_exporter = OTLPMetricExporter(
        endpoint="http://localhost:4317",
        insecure=True
    )
    metric_reader = PeriodicExportingMetricReader(metric_exporter)
    metric_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
    metrics.set_meter_provider(metric_provider)

    # ---- Logging Setup ----
    log_exporter = OTLPLogExporter(
        endpoint="http://localhost:4317",
        insecure=True
    )
    logger_provider = LoggerProvider(resource=resource)
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(log_exporter))  # Corrected line
    _logs.set_logger_provider(logger_provider)

    # Attach OTLP handler to the root logger
    handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)
    logging.getLogger().addHandler(handler)
    LoggingInstrumentor().instrument()

    # Trace propagation
    set_global_textmap(TraceContextTextMapPropagator())
    DjangoInstrumentor().instrument()

    # Example Log
    logger = logging.getLogger(__name__)
    logger.warning("This is a sample log message from Payment Service")


if __name__ == "__main__":
    setup_opentelemetry()
    # You can add some application code here to generate traces, metrics, and logs
    # For example, a simple function that simulates a payment process
    import time
    from opentelemetry import trace

    def process_payment(order_id, amount):
        tracer = trace.get_tracer(__name__)
        with tracer.start_as_current_span("process_payment") as span:
            span.set_attribute("order_id", order_id)
            span.set_attribute("amount", amount)
            logging.info(f"Processing payment for order {order_id} of amount {amount}")
            time.sleep(1)  # Simulate payment processing time
            logging.info(f"Payment processed for order {order_id}")
            return True  # Return boolean


    # generate a trace.
    process_payment("12345", 100.00)
    print("OpenTelemetry initialized and example trace/log generated.  Make sure your OpenTelemetry Collector is running!")
