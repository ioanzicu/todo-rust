# Stage 1: Builder for diesel_cli and dependencies
FROM rust:1.93-slim-bullseye AS diesel-builder

RUN apt-get update -yqq && \
    apt-get install -yqq \
    libpq-dev \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install diesel_cli with version pinning
RUN cargo install diesel_cli --version 2.1.0 --no-default-features --features postgres

# Stage 2: Application builder
FROM rust:1.93-slim-bullseye AS app-builder

# Install build dependencies
RUN apt-get update -yqq && \
    apt-get install -yqq \
    cmake \
    g++ \
    libpq-dev \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy dependency files first for better caching
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to cache dependencies
RUN mkdir -p src && \
    echo "fn main() {println!(\"dummy\");}" > src/main.rs

# Build dependencies only
RUN cargo build --release --locked

# Copy real source code
COPY src ./src
COPY migrations ./migrations

# Touch main.rs to force rebuild of application (not dependencies)
RUN touch src/main.rs

# Build application
RUN cargo build --release --locked

# Stage 3: Runtime image
FROM debian:bullseye-slim

# Install runtime dependencies only
RUN apt-get update -yqq && \
    apt-get install -yqq \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy diesel_cli from first stage
COPY --from=diesel-builder /usr/local/cargo/bin/diesel /usr/local/bin/diesel

WORKDIR /app


# Copy built binary from app-builder
COPY --from=app-builder /usr/src/app/target/release/web_app ./
COPY --from=app-builder /usr/src/app/migrations ./migrations
# COPY config.yml ./

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["./web_app", "config.yml"]