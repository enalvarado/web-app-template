from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, JSON, String

from ..db import Base


# Generic shape until Section 6's per-form table naming convention is decided.
class FormSubmission(Base):
    __tablename__ = "form_submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    form_id = Column(String(100), nullable=False, index=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    payload = Column(JSON, nullable=False)
