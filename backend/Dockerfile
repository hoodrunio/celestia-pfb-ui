# Use Rust official image as the base image
FROM rust:1.67 AS builder

# Create a new empty shell project
RUN USER=root cargo new --bin backend

WORKDIR /backend

# Copy Cargo.toml and Cargo.lock into the container
COPY ./backend/Cargo.toml ./backend/Cargo.lock ./


# Copy the backend source code
COPY ./backend/src ./src

# Build the release version of the backend
RUN cargo build --release

# Create the final image
FROM debian:buster-slim

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the compiled backend binary from the builder
COPY --from=builder /backend/target/release/backend /usr/local/bin/backend

# Expose the port the backend is running on
EXPOSE 8000

# Start the backend
CMD ["backend"]
