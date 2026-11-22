from __future__ import annotations

import uuid
from dataclasses import dataclass

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.models import Membership, Profile, Tenant

bearer = HTTPBearer(auto_error=False)


@dataclass
class AuthUser:
    id: uuid.UUID
    email: str
    full_name: str | None = None
    avatar_url: str | None = None


def _parse_user(payload: dict) -> AuthUser:
    user = payload.get("user") or payload
    uid = user.get("id")
    email = user.get("email")
    if not uid or not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    meta = user.get("user_metadata") or {}
    return AuthUser(
        id=uuid.UUID(str(uid)),
        email=str(email).lower(),
        full_name=meta.get("full_name") or meta.get("name"),
        avatar_url=meta.get("avatar_url") or meta.get("picture"),
    )


def verify_supabase_jwt(token: str, settings: Settings) -> AuthUser:
    """Validate access token via Supabase Auth /user endpoint."""
    if not settings.supabase_url:
        raise HTTPException(status_code=503, detail="Supabase URL not configured")

    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    headers = {"Authorization": f"Bearer {token}"}
    if settings.supabase_anon_key:
        headers["apikey"] = settings.supabase_anon_key

    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(url, headers=headers)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail=f"Auth upstream error: {exc}") from exc

    if res.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return _parse_user(res.json())


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    settings: Settings = Depends(get_settings),
) -> AuthUser:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    return verify_supabase_jwt(creds.credentials, settings)


def ensure_profile(db: Session, user: AuthUser) -> Profile:
    profile = db.get(Profile, user.id)
    if profile:
        changed = False
        if profile.email != user.email:
            profile.email = user.email
            changed = True
        if user.full_name and profile.full_name != user.full_name:
            profile.full_name = user.full_name
            changed = True
        if user.avatar_url and profile.avatar_url != user.avatar_url:
            profile.avatar_url = user.avatar_url
            changed = True
        if changed:
            db.add(profile)
            db.commit()
            db.refresh(profile)
        return profile

    profile = Profile(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_or_create_default_tenant(db: Session, profile: Profile) -> Tenant:
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == profile.id)
        .order_by(Membership.created_at.asc())
        .first()
    )
    if membership:
        tenant = db.get(Tenant, membership.tenant_id)
        if tenant:
            return tenant

    name = (profile.full_name or profile.email.split("@")[0] or "Workspace").strip()
    tenant = Tenant(name=f"{name}'s workspace", onboarded=False)
    db.add(tenant)
    db.flush()
    db.add(Membership(tenant_id=tenant.id, user_id=profile.id, role="owner"))
    db.commit()
    db.refresh(tenant)
    return tenant


def require_user(
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> tuple[AuthUser, Profile, Tenant]:
    profile = ensure_profile(db, user)
    tenant = get_or_create_default_tenant(db, profile)
    return user, profile, tenant
