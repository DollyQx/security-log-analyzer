from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LogEntry(BaseModel):
    ip_address: str = Field(..., alias="ipAddress")
    timestamp: datetime
    status: str  # success / failure
    username: Optional[str] = None

    class Config:
        populate_by_name = True
