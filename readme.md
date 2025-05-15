jaeger-all-in-one.exe ^
  --collector.otlp.grpc.host-port=:4317 ^
  --collector.otlp.http.host-port=:4318 ^
  --collector.zipkin.host-port=:9411 ^
  --collector.http-server.host-port=:14271 ^
  --query.http-server.host-port=:16686 ^
  --collector.grpc-server.host-port=:14250
