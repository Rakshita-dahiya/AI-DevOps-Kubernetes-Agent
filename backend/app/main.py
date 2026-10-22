
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.api.investigation import router as investigation_router

app = FastAPI(
    title="AI Kubernetes Agent",
    description="AI-powered Kubernetes troubleshooting API",
    version="1.0.0",
    
)
app.include_router(investigation_router)

# Allow the frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("AI Kubernetes Agent backend starting")


@app.get("/")
async def root():
    return {
        "message": "AI Kubernetes Agent API",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-kubernetes-agent",
    }
