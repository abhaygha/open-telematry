from opentelemetry.baggage import set_baggage
from opentelemetry.context import attach, get_current
from opentelemetry import trace
import uuid

class BaggageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        transaction_id = request.headers.get("transaction_id", str(uuid.uuid4()))
        print("transaction_id ", transaction_id)
        ctx = set_baggage("transaction_id", transaction_id, context=get_current())
        attach(ctx)

        return self.get_response(request)
