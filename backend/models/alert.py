from pydantic import BaseModel, Field
from datetime import datetime

class Alert(BaseModel):
    ip_address: str = Field(..., alias="ipAddress")
    reason: str
    detected_at: datetime = Field(default_factory=datetime.now, alias="detectedAt")

    class Config:
        populate_by_name = True
