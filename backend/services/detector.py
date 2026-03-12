from datetime import datetime, timedelta
from typing import List
from models.log_entry import LogEntry
from models.alert import Alert

class ThreatDetector:
    def __init__(self, db):
        self.db = db

    async def detect_brute_force(self, ip_address: str):
        # Rule: More than 5 failed login attempts from the same IP within 1 minute
        one_minute_ago = datetime.now() - timedelta(minutes=1)
        
        count = await self.db.logs.count_documents({
            "ipAddress": ip_address,
            "status": "failure",
            "timestamp": {"$gte": one_minute_ago}
        })

        if count > 5:
            alert = Alert(
                ipAddress=ip_address,
                reason=f"Brute force attempt: {count} failures in 1 minute",
                detectedAt=datetime.now()
            )
            await self.db.alerts.insert_one(alert.dict(by_alias=True))
            return alert
        return None

    async def detect_suspicious_ip(self, ip_address: str):
        # Rule: Repeated login failures (total > 20)
        total_failures = await self.db.logs.count_documents({
            "ipAddress": ip_address,
            "status": "failure"
        })

        if total_failures > 20:
            alert = Alert(
                ipAddress=ip_address,
                reason=f"Suspicious IP: {total_failures} total failures",
                detectedAt=datetime.now()
            )
            # Check if this alert already exists recently to avoid spam
            existing = await self.db.alerts.find_one({
                "ipAddress": ip_address,
                "reason": {"$regex": "Suspicious IP"}
            })
            if not existing:
                await self.db.alerts.insert_one(alert.dict(by_alias=True))
                return alert
        return None

    # More rules can be added here
