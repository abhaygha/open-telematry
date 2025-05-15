#!/usr/bin/env python
import logging
logging.basicConfig(level=logging.DEBUG)
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'order_service.settings'
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry import trace
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

trace.set_tracer_provider(
    TracerProvider(
        resource=Resource.create({SERVICE_NAME: "Order-service"})
    )
)
otlp_exporter = OTLPSpanExporter(endpoint="localhost:4317", insecure=True)
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(otlp_exporter))

DjangoInstrumentor().instrument()
tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("manual-debug-span"):
    print("Manual debug span created")
import sys

def main():
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main() 