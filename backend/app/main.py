from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.seed import seed
from app.routers import auth, projects, domains, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables if not existing
    Base.metadata.create_all(bind=engine)
    # Seed database
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Projexus API",
    description="Backend API for Projexus Engineering Showcase Platform",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(domains.router)
app.include_router(stats.router)


@app.get("/")
def root():
    return {
        "name": "Projexus API",
        "status": "operational",
        "version": "2.0.0",
        "docs_url": "/docs",
    }
