# Test Data Setup Guide

## 1. Test User Accounts

### Admin User
```json
{
  "username": "admin",
  "email": "admin@ecart.com",
  "password": "Admin@123",
  "role": "admin"
}
```

### Test Customers
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Test@123",
  "role": "customer"
}
```

## 2. Sample Products

### Electronics Category
```json
{
  "name": "Smartphone X",
  "price": 699.99,
  "category": "Electronics",
  "stock": 50,
  "description": "Latest smartphone with advanced features"
}
```

```json
{
  "name": "Laptop Pro",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 30,
  "description": "High-performance laptop for professionals"
}
```

### Clothing Category
```json
{
  "name": "Men's T-Shirt",
  "price": 29.99,
  "category": "Clothing",
  "stock": 100,
  "description": "Comfortable cotton t-shirt"
}
```

## 3. Test Payment Methods

### Credit Cards
```json
{
  "type": "credit_card",
  "number": "4111111111111111",
  "expiry": "12/25",
  "cvv": "123"
}
```

```json
{
  "type": "credit_card",
  "number": "5555555555554444",
  "expiry": "12/25",
  "cvv": "123"
}
```

## 4. Test Orders

### Successful Order
```json
{
  "user": "john_doe",
  "items": [
    {
      "product": "Smartphone X",
      "quantity": 1
    }
  ],
  "shipping_address": {
    "street": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "zip": "12345"
  },
  "payment_method": "4111111111111111"
}
```

### Order with Error
```json
{
  "user": "john_doe",
  "items": [
    {
      "product": "Out of Stock Item",
      "quantity": 1
    }
  ],
  "shipping_address": {
    "street": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "zip": "12345"
  },
  "payment_method": "4111111111111111"
}
```

## 5. Test Scenarios for Monitoring

### High Load Scenario
1. Open 5 browser windows
2. Login with different test users
3. Browse products simultaneously
4. Add items to cart
5. Proceed to checkout

### Error Scenario
1. Try to order out-of-stock items
2. Use invalid payment details
3. Enter invalid shipping address
4. Try to access restricted areas

### Performance Scenario
1. Load product catalog with filters
2. Search for products
3. Add multiple items to cart
4. Process multiple orders

## 6. Monitoring Setup

### Grafana Alerts
1. High CPU Usage (>80%)
2. High Memory Usage (>80%)
3. High Error Rate (>5%)
4. Slow Response Time (>1s)

### Jaeger Traces to Monitor
1. User Registration Flow
2. Product Search Flow
3. Order Processing Flow
4. Payment Processing Flow

## 7. Dashboard Setup

### Business Metrics Dashboard
1. Total Orders
2. Revenue
3. Active Users
4. Popular Products

### Technical Metrics Dashboard
1. Response Times
2. Error Rates
3. Resource Usage
4. Service Health

## 8. Presentation Flow

### Before Demo
1. Start all services
2. Import test data
3. Set up monitoring
4. Prepare test scenarios

### During Demo
1. Show normal operation
2. Demonstrate error handling
3. Show performance under load
4. Highlight monitoring capabilities

### After Demo
1. Show historical data
2. Explain alerting
3. Discuss improvements
4. Answer questions 