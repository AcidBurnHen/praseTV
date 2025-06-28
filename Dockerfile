# ─── Build frontend ───
FROM node:20-bookworm AS webbuild
WORKDIR /app/web
COPY web/package.json web/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
RUN pnpm install --frozen-lockfile
COPY web/ ./
RUN pnpm run build


# ─── Build backend ───
FROM golang:1.24.4 AS gobuild
WORKDIR /app/server
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
ENV GOOS=linux
ENV GOARCH=amd64
RUN mkdir -p /app/bin
RUN go build -o /app/bin/server
RUN mkdir -p /app/db && cp db/schema.sql /app/db/


# ─── Runtime image ───
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates sqlite3 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy binary, ensure it's executable
COPY --from=gobuild /app/bin/server ./server
RUN chmod +x /app/server

# Copy DB schema
COPY --from=gobuild /app/db /app/db

# Copy frontend build output
COPY --from=webbuild /app/web/dist /app/web

# Data dir + env
RUN mkdir /data
ENV DB_PATH=/data/prasetv.db

CMD ["/app/server"]
