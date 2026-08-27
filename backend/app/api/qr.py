import base64
import io

import qrcode
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Placeholder in-memory registry until an equipment table exists.
EQUIPMENT_REGISTRY: dict[str, dict] = {
    "EQ-001": {"serialNumber": "SN-12345", "warehouseAssignment": "Warehouse A"},
}


class QrGenerateIn(BaseModel):
    referenceId: str


class QrGenerateOut(BaseModel):
    image: str


@router.post("/qr/generate", response_model=QrGenerateOut)
def generate_qr(body: QrGenerateIn):
    img = qrcode.make(body.referenceId)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    encoded = base64.b64encode(buf.getvalue()).decode()
    return QrGenerateOut(image=f"data:image/png;base64,{encoded}")


@router.get("/forms/{form_id}/qr-lookup/{field_name}")
def qr_lookup(form_id: str, field_name: str, code: str):
    record = EQUIPMENT_REGISTRY.get(code)
    if record is None:
        raise HTTPException(status_code=404, detail=f"No record found for code {code}")
    return record
