#!/usr/bin/env bash
echo "Stopping prase.tv containers..."

docker stop prasetv-prasetv_app-1 prasetv-nginx-1 2>/dev/null
docker rm prasetv-prasetv_app-1 prasetv-nginx-1 2>/dev/null

echo "Done. prase.tv is no longer running."