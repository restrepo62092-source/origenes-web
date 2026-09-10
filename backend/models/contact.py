from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timezone
import uuid


class ContactBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    department: str = Field(default="No especificado", max_length=50)
    municipality: str = Field(default="No especificado", max_length=100)
    culture: str = Field(default="No especificado", max_length=50)
    hectares: Optional[float] = Field(None, ge=0)
    message: str = Field(..., min_length=10, max_length=2000)
    soil_ec: Optional[float] = Field(None, ge=0, le=100)
    soil_ph: Optional[float] = Field(None, ge=0, le=14)


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="pending")
