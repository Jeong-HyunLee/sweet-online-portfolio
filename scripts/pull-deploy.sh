#!/bin/bash
# NAS Pull-Deploy Script for JH Lee Lab Website
# Place on NAS at: /volume1/scripts/pull-deploy.sh
# Run via Task Scheduler (cron) every 5 minutes
#
# Prerequisites:
#   1. Create a GitHub PAT (classic) with read:packages scope
#   2. Save it to /volume1/scripts/.ghcr-token
#   3. Run once manually: docker login ghcr.io -u Jeong-HyunLee --password-stdin < /volume1/scripts/.ghcr-token
#      (this stores credentials in ~/.docker/config.json)
#   4. chmod +x /volume1/scripts/pull-deploy.sh

set -euo pipefail

IMAGE="ghcr.io/jeong-hyunlee/lab-website:latest"
CONTAINER_NAME="lab-website"
LOG_FILE="/volume1/scripts/deploy.log"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

# Pull latest image
PULL_OUTPUT=$(docker pull "$IMAGE" 2>&1)

# Check if image was updated
if echo "$PULL_OUTPUT" | grep -q "Status: Image is up to date"; then
  # No change, exit silently
  exit 0
fi

log "New image detected, redeploying..."

# Stop and remove existing container (if running)
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  log "Old container removed"
fi

# Run new container
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 8080:80 \
  -v /volume1/papers:/papers:ro \
  "$IMAGE"

log "New container started successfully"

# Clean up old dangling images
docker image prune -f >> "$LOG_FILE" 2>&1

log "Deploy complete"
