from fastapi import APIRouter

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("/")
def list_approvals() -> dict[str, str]:
    return {"status": "not_implemented", "resource": "approvals"}
