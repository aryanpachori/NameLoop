from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import Base, engine
from app.routers import accounts, approvals, brain, drafts, health, me


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Dev convenience: create tables if missing. Prefer sql/001_init.sql in prod.
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:  # noqa: BLE001
        print(f"[nameloop] DB bootstrap skipped: {exc.__class__.__name__}: {exc}")
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(me.router, prefix=settings.api_prefix)
app.include_router(brain.router, prefix=settings.api_prefix)
app.include_router(accounts.router, prefix=settings.api_prefix)
app.include_router(drafts.router, prefix=settings.api_prefix)
app.include_router(approvals.router, prefix=settings.api_prefix)
