
![Screenshot](/web/public/icon.png)
# prase.tv

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**prase.tv** is a self‑hosted, TV‑friendly bookmark manager. It keeps your browser bookmarks in a local SQLite database and provides a simple web UI optimised for the couch. No cloud, no external tracking—everything runs on your machine.

## Stack
- **Backend**: [Go](https://golang.org/) with [Fiber](https://gofiber.io)
- **Frontend**: [Vite.js](https://vitejs.dev/) + TypeScript
- **Browser Extension**: Chrome extension for syncing bookmarks
- **Database**: SQLite
- **Deployment**: Docker / Docker Compose

## Folder structure
- `/server` – Go API server and database schema
- `/web` – Vite web application
- `/extension` – Chrome extension to sync browser bookmarks
- `/nginx` – Nginx config used by Docker

```
praseTV/
├── server      # Go API
├── web         # Frontend
├── extension   # Browser extension
├── nginx       # Reverse proxy config
└── Dockerfile  # Build all components
```

## Local setup (Docker)
1. Clone the repo and build the containers:
   ```bash
   git clone https://github.com/AcidBurn/prase.tv.git
   cd prase.tv
   docker compose up --build
   ```
2. Open `http://localhost` in a browser. The first run will initialise `prasetv.db` inside the container volume.
3. Install the extension from the `extension/` folder to sync your browser bookmarks.

All data stays local and is served from SQLite. There are no external API calls.

## How it works
- The Dockerfile builds the web UI and Go server into a single image.
- `docker-compose.yml` starts the server and an Nginx proxy on port `80`.
- The Chrome extension sends your bookmarks to `/api/bookmarks/import` and the UI fetches them from `/api/bookmarks`.

![Screenshot](screenshot.png)

## Contributing
Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details. Whether it’s backend features, new UI ideas or extension tweaks—feel free to jump in.

## License
This project is licensed under the [GNU General Public License v3.0](LICENSE).
