# AI Usage

## Why AI is used

Campus to Corporate (C2C) uses AI where language understanding and personalized feedback add value to the employability workflow.

The AI layer is not the product by itself. It supports a larger flow:

**Profile -> assessment -> skill gaps -> action plan -> resume improvement -> interview preparation -> opportunities**

## Current AI responsibilities

| Capability | AI responsibility | Product outcome |
|---|---|---|
| Profile analysis | Interprets profile, skills, goals and experience | Strengths, gaps and recommendations |
| Resume review | Reviews resume text for clarity, relevance and missing evidence | Actionable resume improvements |
| Interview support | Generates/evaluates interview content using student context | Practice questions and feedback |
| Resume parsing | Extracts text from uploaded PDF files before review | Converts an uploaded resume into editable text |

## Architecture

    React UI
       |
       v
    Express API ------> Google Gemini
       |                   |
       |                   v
       |              AI response
       v
    Authenticated student data

The Gemini API key is kept on the backend. The frontend does not receive or store the provider key.

## Fallback behavior

The backend includes deterministic fallback responses for AI endpoints when Gemini is not configured or an external AI request is unavailable. This keeps the hackathon demo usable without pretending that a generated fallback came from Gemini.

The UI therefore has two modes:

- **AI-backed mode:** Gemini generates the response.
- **Fallback mode:** the application returns deterministic guidance.

## Responsible AI notes

- AI output is advisory and should be reviewed by the student.
- The application should not be treated as an automated hiring decision system.
- AI recommendations should be validated against the student's actual goals, skills and experience.
- Secrets are server-side configuration and should never be committed.
- Personal resume/profile information should only be processed when the user chooses to provide it.

## What is intentionally not claimed

C2C does not claim that AI can guarantee employment, predict hiring outcomes, or replace a career counselor/recruiter.

## Future AI improvements

1. Add structured skill-taxonomy mapping.
2. Add explainable evidence for every recommendation.
3. Add evaluation datasets for resume and interview feedback quality.
4. Add user feedback loops to improve recommendations.
5. Add model/provider observability without exposing user data.
