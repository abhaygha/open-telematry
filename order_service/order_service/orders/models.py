from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    ]

    ORDER_METHODS = [
        ('stripe', 'Stripe'),
        ('cod', 'COD'),
    ]

    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]

    customer_id = models.CharField(max_length=255)
    customer_email = models.EmailField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    subscription_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    method = models.CharField(max_length=20, choices=ORDER_METHODS, default='cod')
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')


    def __str__(self):
        return f"Order {self.id} - {self.customer_id}"


class OrderItem(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="item")
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price_per_item = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=255)
    product_id = models.IntegerField(blank=True, null=True)
    size = models.CharField(max_length=5, blank=True, null=True)

    def subtotal(self):
        return self.quantity * self.price_per_item

    def __str__(self):
        return f"{self.product_name} (x{self.quantity})"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('stripe', 'Stripe'),
        ('cod', 'Cash on Delivery'),
    ]

    order = models.OneToOneField(Order, related_name='payment', on_delete=models.CASCADE)
    method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.method} - {self.status}"

class OrderAddress(models.Model):
    order = models.OneToOneField(Order, related_name='address', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    country = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    street = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.city}, {self.state}"
