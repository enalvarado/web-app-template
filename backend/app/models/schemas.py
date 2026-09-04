from typing import Literal, Optional

from pydantic import BaseModel


class LocalizedString(BaseModel):
    en: str
    es: str


class DropdownSource(BaseModel):
    kind: Literal["static", "sql", "excel", "sharepoint"]
    options: Optional[list[str]] = None
    query: Optional[str] = None
    workbookId: Optional[str] = None
    sheet: Optional[str] = None
    siteId: Optional[str] = None
    listId: Optional[str] = None


class FieldConfig(BaseModel):
    name: str
    label: LocalizedString
    type: str
    required: bool = False
    placeholder: Optional[LocalizedString] = None
    helpText: Optional[LocalizedString] = None
    options: Optional[list[LocalizedString]] = None
    source: Optional[DropdownSource] = None
    min: Optional[float] = None
    max: Optional[float] = None
    autoFillTargets: Optional[list[str]] = None
    lookupEndpoint: Optional[str] = None


class ScreenConfig(BaseModel):
    id: str
    title: LocalizedString
    description: Optional[LocalizedString] = None
    fields: list[FieldConfig]


class FormConfig(BaseModel):
    id: str
    title: LocalizedString
    description: Optional[LocalizedString] = None
    includeReviewScreen: bool = False
    screens: list[ScreenConfig]


class SubmissionIn(BaseModel):
    model_config = {"extra": "allow"}


class SubmissionOut(BaseModel):
    id: int
    form_id: str

    model_config = {"from_attributes": True}


class DropdownOptionsOut(BaseModel):
    options: list[str]
