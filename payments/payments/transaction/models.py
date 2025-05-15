from django.db import models

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]

    order_id = models.IntegerField(unique=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method_types = models.CharField(max_length=20, default="card")
    payment_id = models.CharField(max_length=20, default="UNSET", blank=False, null=False)

    def __str__(self):
        return f"Payment {self.id} - Order {self.order_id} - {self.status}"
