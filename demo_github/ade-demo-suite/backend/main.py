import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import console, forge, observer, memory, demo, chat, plan
app = FastAPI(title="ADE Demo Suite API")
# CORS: permettiamo la UI Vite su localhost:5173
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Port configuration (solo informativo, uvicorn usa la sua CLI)
PORT = int(os.getenv("ADE_DEMO_PORT", 8088))
# Routers API
app.include_router(console.router, prefix="/api/console", tags=["console"])
app.include_router(forge.router, prefix="/api/forge", tags=["forge"])
app.include_router(observer.router, prefix="/api/observer", tags=["observer"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])
app.include_router(demo.router, prefix="/api/demo", tags=["demo"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(plan.router, prefix="/api/plan", tags=["plan"])
@app.get("/")
async def root():
    return {
        "message": "ADE Demo Suite Backend Active",
        "mode": os.getenv("DEMO_MODE", "1"),
        "port": PORT,
    }