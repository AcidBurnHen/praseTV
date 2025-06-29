# Contributing to prase.tv

Thank you for considering contributing to **prase.tv**! This project welcomes pull requests and issues from everyone.

## Development setup

1. Install **Go** 1.24+ and **Node.js** 20 with `pnpm`.
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/AcidBurn/prase.tv.git
   cd prase.tv
   in /web
   pnpm install 
   in /server
   go mod download -C 
   ```
3. Run the server and web app together:
   In /web run
   ```bash
    pnpm run dev
   ```

   In /server run
   ```bash
   make build
   make run 
   ```
4. Browse to `http://localhost:3000` for the API and `http://localhost:5173` for the web app during development.

Alternatively you can run everything with Docker using `docker compose up --build`.

## Contribution areas
- **Backend**: Go/Fiber API (`/server`)
- **Frontend**: Vite/TypeScript app (`/web`)
- **Browser extension**: Chrome extension for sync (`/extension`)
- **UI/UX** improvements and documentation

## Guidelines
- Follow the existing code style (gofmt/Prettier).
- Create a pull request referencing any related issues.
- Ensure `docker compose up --build` succeeds before submitting.

We do not currently require a DCO or CLA.

Happy hacking!