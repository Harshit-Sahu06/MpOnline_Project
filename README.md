# MPOnline Project

AI-powered career readiness and employability platform for students.

## Overview

MPOnline Project helps students assess skills, improve resumes, practice interviews, discover jobs and government opportunities, and receive AI-assisted career guidance.

## Architecture

```mermaid
flowchart LR
  U[Student / Admin] --> F[React Frontend]
  F --> A[Express REST API]
  A --> AI[Gemini AI]
  A --> D[(Application Data)]
  F --> V[Career Dashboard]
  V --> J[Jobs & Schemes]
  V --> R[Resume & Interview]
```

## Student Journey

```mermaid
flowchart TD
  S[Sign in / Register] --> P[Profile & Onboarding]
  P --> A[AI Profile Analysis]
  A --> G[Skill Gap Dashboard]
  G --> C[Recommended Courses]
  G --> J[Job Matching]
  P --> R[Resume Review]
  R --> I[Mock Interview]
  J --> O[Career Opportunities]
  C --> O
  I --> O
```

## AI Employability Flow

```mermaid
flowchart LR
  X[Profile + Skills + Resume] --> E[AI Analysis]
  E --> S[Skill Assessment]
  E --> G[Skill Gaps]
  E --> R[Recommendations]
  R --> A[Action Plan]
```

## Resume Optimization

```mermaid
flowchart TD
  R[Upload / Enter Resume] --> P[Parse Profile]
  P --> AI[AI Review]
  AI --> F[Find Missing Skills]
  AI --> W[Improve Wording]
  F --> O[Personalized Suggestions]
  W --> O
```

## Mock Interview

```mermaid
sequenceDiagram
  participant U as Student
  participant F as Frontend
  participant A as API
  participant AI as Gemini
  U->>F: Start interview
  F->>A: Submit profile/question context
  A->>AI: Generate interview prompt
  AI-->>A: Interview question
  A-->>F: Question
  U->>F: Submit answer
  F->>A: Answer + context
  A->>AI: Evaluate response
  AI-->>A: Feedback + score
  A-->>F: Improvement guidance
```

## Admin / Placement Analytics

```mermaid
flowchart TD
  AD[Admin Dashboard] --> M[Monitor Learner Progress]
  AD --> J[Review Opportunities]
  AD --> S[Review Skill Trends]
  M --> I[Identify Skill Gaps]
  I --> P[Plan Training / Courses]
```

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, Lucide React
- Backend: Node.js, Express, JWT, CORS, dotenv
- AI: Google Gemini via `@google/genai`
- Quality: GitHub Actions, Oxlint

## Project Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/ci.yml
├── package.json
└── README.md
```

## Local Setup

```bash
# install frontend dependencies
cd frontend
npm ci

# in another terminal, install backend dependencies
cd backend
npm ci

# start backend
npm start

# start frontend
cd ../frontend
npm run dev
```

Copy `backend/.env.example` to `backend/.env` and configure the required environment variables before using external AI services.

## Demo Personas

The application includes student/admin demo flows for local development. Do not use demo credentials in production.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/auth/personas` | Demo personas |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/verify` | Verify JWT |
| POST | `/api/ai/analyze-profile` | AI profile analysis |
| POST | `/api/ai/review-resume` | AI resume review |
| GET | `/api/jobs` | Job opportunities |
| GET | `/api/govt-schemes` | Government schemes |

## Git Workflow

```mermaid
flowchart LR
  M[main] --> D[develop]
  D --> F[feature/*]
  D --> B[bugfix/*]
  F --> PR[Pull Request]
  B --> PR
  PR --> CI[GitHub Actions]
  CI --> D
  D --> M
```

## CI Pipeline

```mermaid
flowchart LR
  P[Push / PR] --> F[Frontend npm ci]
  F --> L[Lint]
  L --> B[Build]
  P --> BE[Backend npm ci]
  BE --> C[Node syntax checks]
  B --> OK[Checks pass]
  C --> OK
```

## Security Notes

The current application is a hackathon/demo baseline. Before production deployment, move users and opportunity data to persistent storage, rotate secrets, remove demo credentials, validate inputs, add rate limiting, and harden authentication and authorization.

## Roadmap

- Persistent database and migrations
- Production authentication and RBAC
- Verified live opportunity integrations
- Resume PDF parsing
- Advanced employability analytics
- Notifications and application tracking
- Deployment infrastructure and observability

## Contributing

See `CONTRIBUTING.md` for branch, commit, issue, and pull-request conventions.

## License

See `LICENSE`.
