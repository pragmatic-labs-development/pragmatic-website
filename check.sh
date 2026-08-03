#!/usr/bin/env bash
# Pre-push sanity check: HTML tag balance + headless load/console/network
# check + screenshots at the three responsive breakpoints (1024/768/480px).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -d node_modules/playwright ]; then
  echo "Installing dependencies (first run)..."
  npm install --silent
  npx --yes playwright install --with-deps chromium
fi

PORT=8123
python3 -m http.server "$PORT" >/tmp/pragmatic-website-check-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  if curl -s -o /dev/null "http://localhost:$PORT/index.html"; then
    break
  fi
  sleep 0.2
done

node scripts/check.mjs
