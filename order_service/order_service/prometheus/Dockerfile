# prometheus/Dockerfile

FROM prom/prometheus:latest

# Copy our custom config file into the image
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Expose the Prometheus port
EXPOSE 9090

# Start Prometheus
ENTRYPOINT [ "/bin/prometheus" ]

# Command-line arguments
CMD [ \
  "--config.file=/etc/prometheus/prometheus.yml", \
  "--storage.tsdb.path=/prometheus", \
  "--web.console.libraries=/usr/share/prometheus/console_libraries", \
  "--web.console.templates=/usr/share/prometheus/consoles" \
]
