Param(
    [int]$Port = 8001
)
# ADE Demo Suite launcher (Windows PowerShell)
# Usa DEMO_MODE=1 e ADE_DEMO_PORT (default 8001 per allinearsi al setup locale attuale).
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Join-Path $ScriptDir ".." | Resolve-Path
if (-not $env:DEMO_MODE) {
    $env:DEMO_MODE = "1"
}
if (-not $env:ADE_DEMO_PORT) {
    $env:ADE_DEMO_PORT = "$Port"
}
Write-Host "[run-demo.ps1] ROOT_DIR=$RootDir"
Write-Host "[run-demo.ps1] DEMO_MODE=$($env:DEMO_MODE)"
Write-Host "[run-demo.ps1] ADE_DEMO_PORT=$($env:ADE_DEMO_PORT)"
Set-Location $RootDir
# Avvia backend FastAPI
Write-Host "[run-demo.ps1] Avvio backend FastAPI su http://127.0.0.1:$($env:ADE_DEMO_PORT)"
Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --reload --port $($env:ADE_DEMO_PORT)" -WorkingDirectory $RootDir
Start-Sleep -Seconds 2
# Avvia UI Vite
$UiDir = Join-Path $RootDir "ui"
Write-Host "[run-demo.ps1] Avvio UI Vite (npm run dev) su http://localhost:5173"
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory $UiDir
Write-Host "[run-demo.ps1] Demo avviata. Chiudi le finestre dei processi per fermare backend e UI."