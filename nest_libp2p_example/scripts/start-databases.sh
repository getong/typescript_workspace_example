#!/usr/bin/env bash
set -euo pipefail

# Disable BuildKit by default to avoid fetching the remote dockerfile frontend
# (useful in restricted network environments). Override by exporting
# DOCKER_BUILDKIT=1 before running this script.
export DOCKER_BUILDKIT="${DOCKER_BUILDKIT:-0}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_ENV_FILE="$ROOT_DIR/.env"
ENV_FILE="${ENV_FILE:-$DEFAULT_ENV_FILE}"
ENV_TEMPLATE="$ROOT_DIR/.env-example"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but was not found in PATH." >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" && "$ENV_FILE" == "$DEFAULT_ENV_FILE" && -f "$ENV_TEMPLATE" ]]; then
  echo "Creating $ENV_FILE from $(basename "$ENV_TEMPLATE")"
  cp "$ENV_TEMPLATE" "$ENV_FILE"
fi

if [[ -f "$ENV_FILE" ]]; then
  echo "Loading environment variables from $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "No .env file found at $ENV_FILE; using existing environment values."
fi

REDIS_USERNAME="${REDIS_USERNAME:-nestapp}"
REDIS_PASSWORD="${REDIS_PASSWORD:-supersecret}"
REDIS_PORT="${REDIS_PORT:-6379}"

POSTGRES_DB="${POSTGRES_DB:-nestlibp2p}"
POSTGRES_USER="${POSTGRES_USER:-nestapp}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-supersecret}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

build_and_run_redis() {
  local image="nest-libp2p-redis"
  local container="nest-libp2p-redis"

  echo "Building Redis image (${image})..."
  docker build \
    -f "$ROOT_DIR/Dockerfile.redis" \
    -t "$image" \
    --build-arg REDIS_USERNAME="$REDIS_USERNAME" \
    --build-arg REDIS_PASSWORD="$REDIS_PASSWORD" \
    --build-arg REDIS_PORT="$REDIS_PORT" \
    "$ROOT_DIR"

  echo "Restarting Redis container (${container})..."
  docker stop "$container" >/dev/null 2>&1 || true
  docker rm "$container" >/dev/null 2>&1 || true

  docker run -d \
    --name "$container" \
    -p "${REDIS_PORT}:6379" \
    -e REDIS_USERNAME="$REDIS_USERNAME" \
    -e REDIS_PASSWORD="$REDIS_PASSWORD" \
    "$image" >/dev/null

  echo "Redis is listening on port ${REDIS_PORT}"
}

build_and_run_postgres() {
  local image="nest-libp2p-postgres"
  local container="nest-libp2p-postgres"

  echo "Building Postgres image (${image})..."
  docker build \
    -f "$ROOT_DIR/Dockerfile.postgres" \
    -t "$image" \
    --build-arg POSTGRES_DB="$POSTGRES_DB" \
    --build-arg POSTGRES_USER="$POSTGRES_USER" \
    --build-arg POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    --build-arg POSTGRES_PORT="$POSTGRES_PORT" \
    "$ROOT_DIR"

  echo "Restarting Postgres container (${container})..."
  docker stop "$container" >/dev/null 2>&1 || true
  docker rm "$container" >/dev/null 2>&1 || true

  docker run -d \
    --name "$container" \
    -p "${POSTGRES_PORT}:5432" \
    -e POSTGRES_DB="$POSTGRES_DB" \
    -e POSTGRES_USER="$POSTGRES_USER" \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    "$image" >/dev/null

  echo "Postgres is listening on port ${POSTGRES_PORT}"
}

build_and_run_redis
build_and_run_postgres

echo
echo "Active containers:"
docker ps --filter "name=nest-libp2p-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
