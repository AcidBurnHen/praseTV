# praseTV

This project contains a Go API server and a small Vite/TypeScript front-end. A minimal browser extension is also included.

## Running with Docker

The provided `Dockerfile` builds the front-end and the Go server. The `docker-compose.yml` file sets up a persistent volume for the SQLite database and automatically initializes it if it does not exist. To start the application run:

```bash
sudo docker compose up --build
```

The server listens on port `3000`. When the container starts for the first time it will automatically initialize the SQLite database using `server/db/schema.sql`.

After building, open `http://localhost:3000` to see the web interface.