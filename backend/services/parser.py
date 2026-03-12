import re
from datetime import datetime
from typing import List, Dict
from models.log_entry import LogEntry

# Example log format: [2023-10-27 10:00:00] IP: 192.168.1.1 User: admin Status: success
# We can adapt this to common auth log formats
LOG_PATTERN = r"\[(?P<timestamp>.*?)\] IP: (?P<ip>.*?) User: (?P<user>.*?) Status: (?P<status>success|failure)"

class LogParser:
    @staticmethod
    def parse_line(line: str) -> Dict:
        match = re.search(LOG_PATTERN, line)
        if match:
            return {
                "ipAddress": match.group("ip"),
                "timestamp": datetime.strptime(match.group("timestamp"), "%Y-%m-%d %H:%M:%S"),
                "username": match.group("user"),
                "status": match.group("status")
            }
        return None

    @classmethod
    def parse_logs(cls, content: str) -> List[LogEntry]:
        entries = []
        for line in content.splitlines():
            data = cls.parse_line(line)
            if data:
                entries.append(LogEntry(**data))
        return entries
