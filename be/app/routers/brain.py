from fastapi import APIRouter

router = APIRouter(prefix="/brain", tags=["brain"])


@router.get("/")
def get_brain() -> dict[str, str]:
    return {"status": "not_implemented", "resource": "brain"}
