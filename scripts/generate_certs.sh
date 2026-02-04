#!/bin/bash
set -e

echo "Generating SSL certificates..."

# From your project root directory
mkdir -p nginx/ssl && \
cd nginx/ssl && \
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout self.key \
  -out self.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" && \
ls -la && \
echo "Certificate created successfully!" && \
cat self.crt