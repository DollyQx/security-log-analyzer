# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability within `security-log-analyzer`, please submit your report privately to the maintainers.

## Security Practices & SIEM Standards

1. **Log Ingestion & Parsing Sanitization**:
   - Log input lines parsed by `services/parser.py` undergo regex sanitization to prevent log injection and command execution vectors.
2. **Environment Variables**:
   - Database connection URIs (`MONGODB_URL`) and server configurations must be supplied via `.env` files and excluded from repository version control.
3. **Detection Rules**:
   - Threat detection rules (`services/detector.py`) evaluate brute force, SQL injection, and path traversal signatures locally.
