from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Brain, Tenant

router = APIRouter(prefix="/me", tags=["me"])


class MeResponse(BaseModel):
    user_id: str
    email: str
    full_name: str | None
    avatar_url: str | None
    tenant_id: str
    tenant_name: str
    product_url: str | None
    onboarded: bool


class BootstrapBody(BaseModel):
    workspace_name: str | None = Field(default=None, max_length=160)
    product_url: str | None = Field(default=None, max_length=512)


@router.get("", response_model=MeResponse)
def read_me(ctx: tuple = Depends(require_user)) -> MeResponse:
    user, profile, tenant = ctx
    return MeResponse(
        user_id=str(user.id),
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        tenant_id=str(tenant.id),
        tenant_name=tenant.name,
        product_url=tenant.product_url,
        onboarded=tenant.onboarded,
    )


@router.post("/bootstrap", response_model=MeResponse)
def bootstrap_workspace(
    body: BootstrapBody,
    ctx: tuple = Depends(require_user),
    db: Session = Depends(get_db),
) -> MeResponse:
    user, profile, tenant = ctx

    if body.workspace_name and body.workspace_name.strip():
        tenant.name = body.workspace_name.strip()
    if body.product_url and body.product_url.strip():
        url = body.product_url.strip()
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"
        tenant.product_url = url

    if tenant.brain is None:
        db.add(Brain(tenant_id=tenant.id, payload={}))

    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    return MeResponse(
        user_id=str(user.id),
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        tenant_id=str(tenant.id),
        tenant_name=tenant.name,
        product_url=tenant.product_url,
        onboarded=tenant.onboarded,
    )


@router.post("/onboarded", response_model=MeResponse)
def mark_onboarded(
    ctx: tuple = Depends(require_user),
    db: Session = Depends(get_db),
) -> MeResponse:
    user, profile, tenant = ctx
    tenant.onboarded = True
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return MeResponse(
        user_id=str(user.id),
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        tenant_id=str(tenant.id),
        tenant_name=tenant.name,
        product_url=tenant.product_url,
        onboarded=tenant.onboarded,
    )
