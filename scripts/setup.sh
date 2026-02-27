#!/usr/bin/env bash
ROOT_DIR="$(pwd)"
BACKEND_DIR="$ROOT_DIR/apps/back-end"

echo "Installing dependencies..."
pnpm install

echo "Building all packages..."
pnpm build

echo "Applying DB migrations..."
cd "$BACKEND_DIR"

pnpm db:migrate:prod

echo "Running seed script..."
pnpm db:seed:prod

echo "Done"