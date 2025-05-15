#!/usr/bin/env python
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'order_service.settings'
from opentelemetry.instrumentation.django import DjangoInstrumentor
DjangoInstrumentor().instrument()
from opentelemetry import trace
tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("startup-span"):
    pass
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