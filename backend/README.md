# Campus to Corporate — Backend API

Express REST API powering the AI career-readiness platform.

## Setup

    cd backend
    npm install
    cp .env.example .env
    npm start

The API runs on port 5000 by default.

## Environment

See .env.example for the complete configuration.

Important local settings:

- JWT_SECRET: required for production; use a long random value locally.
- GEMINI_API_KEY: optional for Gemini-backed responses.
- FRONTEND_ORIGIN: allowed browser origin.
- SEED_DEMO_USERS: controls local demo-user seeding.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/auth/personas | Demo personas |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Authenticate user |
| POST | /api/auth/logout | End session |
| GET | /api/auth/verify | Verify session |
| PATCH | /api/auth/profile | Update authenticated profile |
| POST | /api/ai/analyze-profile | AI profile analysis |
| POST | /api/ai/review-resume | AI resume review |
| POST | /api/ai/parse-resume | Extract text from PDF resume |
| GET | /api/jobs | Verified-source job opportunities |
| GET | /api/govt-schemes | Government opportunity data |
| GET | /api/sources | Source metadata |

## Security baseline

- JWT is verified with issuer and audience checks.
- Browser sessions use an HttpOnly c2c_session cookie.
- AI and authentication routes are rate-limited.
- Admin-only functionality uses role middleware.
- Gemini credentials remain server-side.
- Resume uploads are PDF-only and limited to 5 MB.
- Passwords use scrypt hashing with per-password random salts.

## Data and external sources

The prototype uses a JSON-backed persistent repository.

Opportunity data is fetched from the National Career Service source and returned with source/freshness metadata. If the source fails, the API does not fabricate live listings.

## AI fallback

AI features use Google Gemini when configured. If Gemini is unavailable, deterministic fallback responses keep the demo functional and are not represented as live Gemini output.

See the root AI_USAGE.md and LIMITATIONS.md for product-level details.