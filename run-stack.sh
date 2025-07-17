#!/usr/bin/env bash
set -euo pipefail

echo -e "\n🚀  Building & starting Docker containers…"
docker compose up -d --build

echo -e "\n⏳  Waiting a few seconds…"
sleep 10

echo -e "\n🌐  Opening browser at http://localhost:3000"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://localhost:3000
elif command -v open >/dev/null 2>&1; then   # macOS
  open http://localhost:3000
else
  echo "Open your browser and go to http://localhost:3000"
fi
