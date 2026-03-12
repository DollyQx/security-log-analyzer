from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from models.log_entry import LogEntry
from services.parser import LogParser
from services.detector import ThreatDetector
from utils.db import get_db
from datetime import datetime

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.post("/upload")
async def upload_logs(file: UploadFile = File(...), db = Depends(get_db)):
    content = await file.read()
    logs_content = content.decode("utf-8")
    
    entries = LogParser.parse_logs(logs_content)
    if not entries:
        raise HTTPException(status_code=400, detail="No valid logs found in file")

    # Insert logs into database
    log_dicts = [entry.dict(by_alias=True) for entry in entries]
    await db.logs.insert_many(log_dicts)

    # Run threat detection for each IP in the uploaded batch
    detector = ThreatDetector(db)
    unique_ips = set(entry.ip_address for entry in entries)
    
    alerts_found = []
    for ip in unique_ips:
        alert1 = await detector.detect_brute_force(ip)
        alert2 = await detector.detect_suspicious_ip(ip)
        if alert1: alerts_found.append(alert1)
        if alert2: alerts_found.append(alert2)

    return {
        "message": f"Successfully processed {len(entries)} log entries",
        "logs_count": len(entries),
        "alerts_count": len(alerts_found)
    }

@router.get("/", response_model=List[LogEntry])
async def get_logs(limit: int = 100, db = Depends(get_db)):
    cursor = db.logs.find().sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    return logs
