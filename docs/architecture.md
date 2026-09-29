# Architecture

## System overview

    Student / Admin
           |
           v
    React + Vite UI
           |
           v
    Express REST API
      |     |      |       |
      v     v      v       v
     Auth  Store  Gemini  PDF Parser
      |     |              |
      +-----+--------------+
             |
             v
       Student data

    Express API ---> National Career Service
    Express API ---> React UI

## Employability workflow

    Student Profile + Resume
             |
             v
       AI Assessment
             |
       +-----+------+
       |            |
       v            v
    Skill Gaps   Strengths
       |
       v
    Learning / Action Plan
       |
       +------------+
       |            |
       v            v
    Interview    Opportunities
       |
       v
    Feedback

## Backend request flow

    Browser
       |
       | session cookie
       v
    Express API
       |
       v
    Auth middleware
       |
       v
    Authenticated user
       |
       +--> JSON repository
       +--> Gemini AI
       +--> PDF parser
       +--> NCS source
       |
       v
    JSON response
       |
       v
    Browser

## Security boundaries

- Browser stores only the current user representation in sessionStorage.
- Authentication is carried by an HttpOnly c2c_session cookie.
- Bearer authentication remains supported for API clients.
- JWT issuer and audience are verified.
- Production requires JWT_SECRET.
- Authentication and AI endpoints are rate-limited.
- Admin-only routes use role middleware.
- Gemini credentials remain server-side.
- Resume upload is restricted to PDF and 5 MB.
- Runtime database files are ignored by Git.

## Deployment shape

    Browser
       |
       v
    React/Vite frontend
       |
       v
    Node/Express backend
       +-- JSON persistence
       +-- Gemini
       +-- PDF parser
       +-- NCS source

This keeps the hackathon architecture understandable and avoids infrastructure that does not directly improve the user journey.
