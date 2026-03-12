from fastapi import APIRouter, Depends
from typing import List
from models.alert import Alert
from utils.db import get_db

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("/", response_model=List[Alert])
async def get_alerts(limit: int = 50, db = Depends(get_db)):
    cursor = db.alerts.find().sort("detectedAt", -1).limit(limit)
    alerts = await cursor.to_list(length=limit)
    return alerts
