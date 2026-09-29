# Limitations

This project is a hackathon-ready prototype, not a production employment platform.

## Current limitations

### 1. Persistence

The backend uses a JSON-backed repository for demo persistence. It is suitable for a single-instance prototype but is not a replacement for a production relational or distributed database.

### 2. Opportunity coverage

The integrated verified opportunity source is the **National Career Service (NCS)** latest-updates page. Source availability and page structure can change. If the source cannot be fetched, the API returns an empty result with source-error metadata rather than fabricating listings.

### 3. AI reliability

AI output can be incomplete, inconsistent or occasionally incorrect. Gemini availability is external to the application, and deterministic fallback responses are used when the AI provider is unavailable.

### 4. Resume parsing

PDF parsing is text-oriented. Scanned/image-only PDFs or unusual layouts may not extract cleanly.

### 5. Authentication scale

Authentication uses JWT sessions with an HttpOnly cookie and in-memory rate limiting. This is appropriate for a hackathon prototype but should be replaced or extended for horizontally scaled production deployment.

### 6. Demo/admin scope

Admin functionality is designed to demonstrate placement/analytics concepts. It is not a complete enterprise placement-management suite.

### 7. No employment guarantee

Recommendations and opportunity matching are informational. They do not guarantee interviews, offers or employment.

## Production hardening roadmap

Before a public production deployment:

- move persistence to a managed database;
- add database migrations and backups;
- use distributed rate limiting;
- add stronger input/schema validation;
- add structured audit logging and monitoring;
- add automated security/dependency scanning;
- add comprehensive API and end-to-end tests;
- improve PDF OCR for scanned resumes;
- add resilient, versioned opportunity-source adapters;
- add privacy/retention controls appropriate to local law and institutional policy;
- deploy behind HTTPS with production cookie/security settings;
- add observability and incident response procedures.
