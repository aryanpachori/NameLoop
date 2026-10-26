from fastapi import APIRouter

router = APIRouter(prefix="/drafts", tags=["drafts"])


@router.get("/")
def list_drafts() -> dict[str, str]:
    return {"status": "not_implemented", "resource": "drafts"}
