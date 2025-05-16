# Test Scenarios for Stakeholder Presentation

## 1. Basic User Journey

### Scenario 1: New User Registration
1. Open E-Cart Frontend (http://localhost:3000)
2. Click "Register" button
3. Fill in registration form
4. Submit registration
5. **Show in Jaeger**: 
   - Trace the complete registration flow
   - Highlight service interactions
   - Show response times

### Scenario 2: Product Browsing
1. Login with test user
2. Browse product catalog
3. Filter products by category
4. Search for specific product
5. **Show in Jaeger**:
   - Service dependencies
   - Cache hits/misses
   - Response times

### Scenario 3: Order Placement
1. Add items to cart
2. Proceed to checkout
3. Enter shipping details
4. Select payment method
5. Place order
6. **Show in Jaeger**:
   - Complete order flow
   - Service interactions
   - Transaction timing

## 2. Performance Testing Scenarios

### Scenario 4: Concurrent Users
1. Open multiple browser windows
2. Simulate multiple users browsing
3. **Show in Grafana**:
   - CPU utilization
   - Memory usage
   - Network traffic
   - Response times

### Scenario 5: Error Handling
1. Enter invalid payment details
2. Try to order out-of-stock items
3. **Show in Jaeger**:
   - Error tracking
   - Service recovery
   - Error handling flow

## 3. Dashboard Demonstrations

### Grafana Dashboard Walkthrough
1. **System Health**
   - CPU Usage Graph
   - Memory Utilization
   - Disk I/O Metrics
   - Network Traffic

2. **Business Metrics**
   - Active Users Counter
   - Order Success Rate
   - Average Response Time
   - Error Rate

### Jaeger Dashboard Walkthrough
1. **Service Map**
   - Show service dependencies
   - Highlight communication paths
   - Display service health

2. **Trace Analysis**
   - Show complete order flow
   - Highlight bottlenecks
   - Display response times

## 4. Presentation Flow

### Before Demo
1. Start all services:
   ```bash
   ./start-all-services.ps1
   ```

2. Prepare test data:
   - Create test user accounts
   - Add sample products
   - Set up test payment methods

3. Open dashboards:
   - Jaeger UI: http://localhost:16686
   - Grafana: http://localhost:3000

### During Demo
1. Start with basic user journey
2. Show real-time metrics in Grafana
3. Demonstrate trace analysis in Jaeger
4. Highlight business impact
5. Show error handling
6. Demonstrate scalability

### After Demo
1. Show historical data
2. Explain alerting setup
3. Discuss monitoring strategy
4. Answer questions

## 5. Key Metrics to Highlight

### Business Metrics
- Order Success Rate
- Average Order Value
- User Engagement
- System Uptime

### Technical Metrics
- Response Times
- Error Rates
- Resource Utilization
- Service Dependencies

## 6. Troubleshooting Guide

### Common Issues
1. Service not starting
   - Check port availability
   - Verify configuration
   - Check logs

2. Dashboard not loading
   - Verify service status
   - Check network connectivity
   - Clear browser cache

3. No traces showing
   - Verify OpenTelemetry setup
   - Check service instrumentation
   - Verify collector configuration 