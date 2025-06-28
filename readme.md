# praseTV

This project contains a Go API server and a small Vite/TypeScript front-end. A minimal browser extension is also included.

## Running with Docker

The provided `Dockerfile` builds the front-end and the Go server. The `docker-compose.yml` file sets up a persistent volume for the SQLite database and automatically initializes it if it does not exist. To start the application run:

```bash
sudo docker compose up --build
```

The server listens on port `9600`. When the container starts for the first time it will automatically initialize the SQLite database using `server/db/schema.sql`.

After building, open `http://localhost:9600` to see the web interface.


# Bonus 

If you want to locally route a custom domain like prase.tv to localhost:9600 (or whatever port you pick)

Run this command , or set up dnsmasq 
`echo "127.0.0.1 prase.tv" | sudo tee -a /etc/hosts`
