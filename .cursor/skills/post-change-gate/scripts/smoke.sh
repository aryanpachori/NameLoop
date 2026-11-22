#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"

echo "== FE tsc =="
(cd "$ROOT/fe" && npx tsc --noEmit)

echo "== BE import =="
(cd "$ROOT/be" && .venv/bin/python -c "from app.main import app; print('import_ok', app.title)")

echo "== Health (if up) =="
if curl -sf "http://127.0.0.1:8000/health" >/tmp/nameloop-health.json; then
  cat /tmp/nameloop-health.json
  echo
else
  echo "API not reachable on :8000 (ok if not started)"
fi

echo "smoke: ok"
