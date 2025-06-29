#!/usr/bin/env bash
set -e

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: sudo bash ./launch.sh |OR| chmod +x run_prasetv.sh"
    echo "Runs prase.tv in Docker and opens it in kiosk mode with your chosen browser."
    exit 0
fi

# Detect common Chromium-based browsers
BROWSERS=()
CANDIDATES=(google-chrome chromium-browser chromium brave-browser brave microsoft-edge edge chrome)
for c in "${CANDIDATES[@]}"; do
    if command -v "$c" >/dev/null 2>&1; then
        BROWSERS+=("$c")
    fi
done

# Ask user for browser selection
choose_browser() {
    echo "Detected browsers:" >&2
    local idx=1
    for b in "${BROWSERS[@]}"; do
        echo " $idx) $b" >&2
        ((idx++))
    done

    echo " $idx) Enter custom path" >&2
    read -rp "Select browser number: " choice || exit 1

    if [[ "$choice" =~ ^[0-9]+$ ]] && ((choice >= 1 && choice <= ${#BROWSERS[@]})); then
        BROWSER="$(command -v "${BROWSERS[$((choice - 1))]}")"
    elif [[ "$choice" -eq "$idx" ]]; then
        read -rp "Enter full path to browser executable: " BROWSER || exit 1
    else
        BROWSER="$choice"
    fi

    if [[ ! -x "$BROWSER" ]]; then
        echo "Browser executable not found or not executable: $BROWSER" >&2
        exit 1
    fi
}

# Check if Docker is installed
install_docker() {
    if command -v docker >/dev/null 2>&1; then
        return
    fi

    echo "Docker not found. Installing via official script..." >&2

    # Run install script
    if [ "$(id -u)" -eq 0 ]; then
        curl -fsSL https://get.docker.com | sh
    else
        curl -fsSL https://get.docker.com | sudo sh
    fi

    # Force refresh path cache just in case
    hash -r
    export PATH="/usr/local/bin:/usr/bin:$PATH"

    # Add current user to docker group if needed
    if ! groups "$USER" | grep -q '\bdocker\b'; then
        echo "Adding user '$USER' to docker group..." >&2
        sudo usermod -aG docker "$USER"

        echo "Switching to docker group for current shell..." >&2
        exec sg docker "$0"  # Rerun this script with docker group permissions
        exit 0
    fi

    # Verify it worked
    if ! command -v docker >/dev/null 2>&1; then
        echo "Docker installed but not found in PATH. Please restart your terminal." >&2
        exit 1
    fi
}

# Launch Docker Compose
run_compose() {
    if docker compose version >/dev/null 2>&1; then
        echo "Running: docker compose up --build -d"
        if docker compose up --build -d; then
            return
        else
            sudo docker compose up --build -d
        fi
    elif docker-compose --version >/dev/null 2>&1; then
        echo "Running: docker-compose up --build -d"
        if docker-compose up --build -d; then
            return
        else
            sudo docker-compose up --build -d
        fi
    else
        echo "Neither 'docker compose' nor 'docker-compose' is available." >&2
        exit 1
    fi
}

# Open browser in kiosk mode with extension
open_browser() {
    local ext_dir="$(pwd)/extension"

    if [[ ! -d "$ext_dir" ]]; then
        echo "Warning: Extension directory not found: $ext_dir" >&2
        echo "Browser will still launch without it." >&2
        ext_dir=""
    fi

    echo "Launching browser: $BROWSER"

    "$BROWSER" \
        --kiosk "http://prase.tv" \
        ${ext_dir:+--load-extension="$ext_dir"} \
        &
}


# Ensure there's a local host entry on new machine 
ensure_local_host_mapping_exists() {
    local host_entry="127.0.0.1 prase.tv"

    if ! grep -qF "prase.tv" /etc/hosts; then
        echo "Adding prase.tv to /etc/hosts..."
        echo "$host_entry" | sudo tee -a /etc/hosts > /dev/null
    fi
}


choose_browser
ensure_local_host_mapping_exists
install_docker
run_compose
echo "Waiting for server to start..."
sleep 2
open_browser
