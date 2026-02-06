#!/usr/bin/env bash
set -e
# ADE Demo Suite launcher (Linux/macOS)
# Usa DEMO_MODE=1 e ADE_DEMO_PORT (default 8001 per allinearsi al setup locale attuale).
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export DEMO_MODE="${DEMO_MODE:-1}"
export ADE_DEMO_PORT="${ADE_DEMO_PORT:-8001}"
echo "[run-demo.sh] ROOT_DIR=${ROOT_DIR}"
echo "[run-demo.sh] DEMO_MODE=${DEMO_MODE}"
echo "[run-demo.sh] ADE_DEMO_PORT=${ADE_DEMO_PORT}"
cd "${ROOT_DIR}"
# Avvia backend FastAPI
echo "[run-demo.sh] Avvio backend FastAPI su http://127.0.0.1:${ADE_DEMO_PORT}"
python -m uvicorn backend.main:app --reload --port "${ADE_DEMO_PORT}" &
BACKEND_PID=$!
# Aspetta un attimo che il backend salga
sleep 2
# Avvia UI Vite
echo "[run-demo.sh] Avvio UI Vite (npm run dev) su http://localhost:5173"
cd "${ROOT_DIR}/ui"
npm run dev &
echo "[run-demo.sh] Backend PID=${BACKEND_PID}"
echo "[run-demo.sh] Demo avviata. Premi CTRL+C per fermare i processi (potresti dover chiudere le shell manualmente)."