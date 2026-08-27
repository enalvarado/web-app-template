from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..datasources.sql_source import SqlDataSource
from ..db import get_db
from ..models.schemas import DropdownOptionsOut

router = APIRouter()


@router.get("/forms/{form_id}/dropdowns/{field_name}", response_model=DropdownOptionsOut)
def get_dropdown_options(form_id: str, field_name: str, query: str, db: Session = Depends(get_db)):
    source = SqlDataSource(db)
    return DropdownOptionsOut(options=source.get_options(query))
