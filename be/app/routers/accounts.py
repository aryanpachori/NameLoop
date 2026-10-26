from fastapi import APIRouter

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("/")
def list_accounts() -> dict[str, str]:
    return {"status": "not_implemented", "resource": "accounts"}
