import base64
import re

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..models.db_models import FormSubmission
from ..models.schemas import SubmissionIn, SubmissionOut
from ..storage.local_storage import LocalStorage

router = APIRouter()
storage = LocalStorage(settings.storage_dir)

DATA_URL_RE = re.compile(r"^data:image/(?P<ext>\w+);base64,(?P<data>.+)$")


def _extract_images(payload: dict) -> dict:
    processed = {}
    for key, value in payload.items():
        match = DATA_URL_RE.match(value) if isinstance(value, str) else None
        if match:
            raw = base64.b64decode(match.group("data"))
            path = storage.save(f"{key}.{match.group('ext')}", raw)
            processed[key] = path
        else:
            processed[key] = value
    return processed


@router.post("/forms/{form_id}/submissions", response_model=SubmissionOut)
def create_submission(form_id: str, submission: SubmissionIn, db: Session = Depends(get_db)):
    payload = _extract_images(submission.model_dump())
    record = FormSubmission(form_id=form_id, payload=payload)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
