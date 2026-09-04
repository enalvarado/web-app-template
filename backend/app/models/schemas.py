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
    # Layout / presentation
    width: Optional[float] = None
    hideLabel: Optional[bool] = None
    disabled: Optional[bool] = None
    background: Optional[str] = None
    textColor: Optional[str] = None
    fontSize: Optional[str] = None
    # radio only
    layout: Optional[Literal["horizontal", "vertical"]] = None
    # image only
    src: Optional[str] = None
    alt: Optional[LocalizedString] = None
    align: Optional[Literal["left", "center", "right"]] = None
    # accordion only — one level of nesting, no accordion-in-accordion
    content: Optional[LocalizedString] = None
    defaultOpen: Optional[bool] = None
    children: Optional[list["FieldConfig"]] = None
    # button only (a content-block button, e.g. nested inside an accordion)
    action: Optional[Literal["next", "back", "submit", "reset", "goto", "none"]] = None
    targetScreenId: Optional[str] = None
    style: Optional[Literal["primary", "outline"]] = None


FieldConfig.model_rebuild()


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
    headerLogoUrl: Optional[str] = None
    headerLogoPosition: Optional[Literal["left", "right"]] = None
    headerLogoSize: Optional[float] = None
    backgroundImageUrl: Optional[str] = None
    screens: list[ScreenConfig]


class SubmissionIn(BaseModel):
    model_config = {"extra": "allow"}


class SubmissionOut(BaseModel):
    id: int
    form_id: str

    model_config = {"from_attributes": True}


class DropdownOptionsOut(BaseModel):
    options: list[str]
