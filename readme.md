jaeger-all-in-one.exe ^
  --collector.otlp.grpc.host-port=:4317 ^
  --collector.otlp.http.host-port=:4318 ^
  --collector.zipkin.host-port=:9411 ^
  --collector.http-server.host-port=:14271 ^
  --query.http-server.host-port=:16686 ^
  --collector.grpc-server.host-port=:14250

# Implementation Plan: Distributed Tracing and Metrics with Django Microservices

## Overview
This project demonstrates distributed tracing across multiple Django-based microservices using OpenTelemetry and Jaeger, and system resource monitoring using Prometheus and Grafana.

---

## 1. Distributed Tracing with OpenTelemetry, Jaeger, and Django

### a. OpenTelemetry Instrumentation
- Each Django microservice is instrumented with OpenTelemetry Python SDK.
- The tracer provider is initialized at the very start of each service (in `manage.py`), setting a unique `service.name` for each microservice (e.g., `Order-service`, `Payment-service`, etc.).
- The OTLP gRPC exporter is configured to send traces to the OpenTelemetry Collector at `localhost:4317`.

### b. OpenTelemetry Collector
- The Collector receives traces from all services via OTLP (gRPC).
- It is configured to export traces to Jaeger for visualization.

### c. Jaeger
- Jaeger is used as the tracing backend and UI.
- All traces from the Django services are visible in the Jaeger UI, allowing you to search, view, and analyze distributed traces across services.

---

## 2. System Resource Metrics with Prometheus and Grafana

### a. Prometheus
- Prometheus is configured to scrape system resource metrics (CPU, memory, disk, network, etc.) from the OpenTelemetry Collector's hostmetrics receiver.
- Only system resource metrics are scraped (no application-level metrics).

### b. Grafana
- Grafana is connected to Prometheus as a data source.
- Dashboards are set up to visualize system resource metrics (CPU usage, memory usage, disk usage, network stats, etc.) for the infrastructure running the microservices.

---

## 3. How to Test
- Make requests to each Django service endpoint (via browser, curl, or Postman).
- Check Jaeger UI (`http://localhost:16686`) to see traces for each service.
- Visit Grafana (`http://localhost:3000`) to view system resource dashboards (login with your configured credentials).

---

## 4. Summary
- **OpenTelemetry**: Instrumentation and trace export from Django services.
- **Jaeger**: Distributed tracing backend and UI.
- **Prometheus**: Scrapes system resource metrics from the Collector.
- **Grafana**: Visualizes system resource metrics.

This setup provides full visibility into both distributed requests across your Django microservices and the health of the underlying infrastructure.
