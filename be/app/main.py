from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import accounts, approvals, brain, drafts

app = FastAPI(title="NameLoop API", version="0.1.0")

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

app.include_router(brain.router)
app.include_router(accounts.router)
app.include_router(drafts.router)
app.include_router(approvals.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "nameloop"}
