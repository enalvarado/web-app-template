from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import dropdowns, qr, submissions
from .config import settings
from .db import Base, engine
from .security import require_api_key


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Web App Template Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

protected = [Depends(require_api_key)]
app.include_router(submissions.router, prefix="/api", dependencies=protected)
app.include_router(dropdowns.router, prefix="/api", dependencies=protected)
app.include_router(qr.router, prefix="/api", dependencies=protected)


@app.get("/api/health")
def health():
    return {"status": "ok"}
