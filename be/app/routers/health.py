from fastapi import APIRouter
from sqlalchemy.exc import SQLAlchemyError

from app.config import get_settings
from app.db import ping_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    settings = get_settings()
    db_ok = False
    db_error: str | None = None
    try:
        db_ok = ping_db()
    except SQLAlchemyError as exc:
        db_error = str(exc.__class__.__name__)
    except Exception as exc:  # noqa: BLE001 — surface connection failures cleanly
        db_error = str(exc.__class__.__name__)

    return {
        "status": "ok" if db_ok else "degraded",
        "service": "nameloop",
        "env": settings.app_env,
        "database": "up" if db_ok else "down",
        "database_error": db_error,
        "google_oauth_configured": bool(settings.google_client_id and settings.google_client_secret),
        "supabase_url": settings.supabase_url,
    }
