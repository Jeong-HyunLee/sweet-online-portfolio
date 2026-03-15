#!/bin/bash
# NAS Pull-Deploy Script for JH Lee Lab Website
# Location: /volume1/scripts/pull-deploy.sh
# Cron: every 5 minutes via DSM Task Scheduler (run as root)

set -euo pipefail

IMAGE="ghcr.io/jeong-hyunlee/lab-website:latest"
CONTAINER_NAME="lab-website"
LOG_FILE="/volume1/scripts/deploy.log"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

# Get current image digest (if container exists)
OLD_DIGEST=$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || echo "none")

# Pull latest
docker pull "$IMAGE" > /dev/null 2>&1

# Get new image digest
NEW_DIGEST=$(docker inspect --format='{{.Id}}' "$IMAGE" 2>/dev/null || echo "unknown")

# Compare
if [ "$OLD_DIGEST" = "$NEW_DIGEST" ]; then
  exit 0
fi

log "New image detected (${NEW_DIGEST:7:12}), redeploying..."

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  log "Old container removed"
fi

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 8080:80 \
  -v /volume1/papers:/papers:ro \
  "$IMAGE"

log "New container started successfully"
docker image prune -f >> "$LOG_FILE" 2>&1
log "Deploy complete"
