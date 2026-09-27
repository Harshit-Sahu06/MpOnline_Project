# MPOnline Project — Backend API

Express REST API powering the AI career-readiness platform.

## Setup

```bash
cd backend
npm ci
cp .env.example .env
npm start
```

The API runs on port 5000 by default.

## Endpoints

- GET /api/health
- GET /api/auth/personas
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify
- POST /api/ai/analyze-profile
- POST /api/ai/review-resume
- GET /api/jobs
- GET /api/govt-schemes

AI features use Google Gemini when configured and the application contains a deterministic fallback for demo use.