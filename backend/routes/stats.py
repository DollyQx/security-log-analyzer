from fastapi import APIRouter, Depends
from utils.db import get_db
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/")
async def get_stats(db = Depends(get_db)):
    total_attempts = await db.logs.count_documents({})
    failed_attempts = await db.logs.count_documents({"status": "failure"})
    success_attempts = await db.logs.count_documents({"status": "success"})
    
    # Suspicious IPs (those with alerts)
    suspicious_ips = await db.alerts.distinct("ipAddress")
    
    # Stats for chart: attempts per hour (last 24 hours)
    last_24h = datetime.now() - timedelta(hours=24)
    pipeline = [
        {"$match": {"timestamp": {"$gte": last_24h}}},
        {
            "$group": {
                "_id": {"$hour": "$timestamp"},
                "count": {"$sum": 1},
                "failed": {"$sum": {"$cond": [{"$eq": ["$status", "failure"]}, 1, 0]}}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    hourly_stats = await db.logs.aggregate(pipeline).to_list(length=24)

    return {
        "totalAttempts": total_attempts,
        "failedAttempts": failed_attempts,
        "successAttempts": success_attempts,
        "suspiciousIPsCount": len(suspicious_ips),
        "hourlyStats": hourly_stats
    }
