# Hackathon Readiness Plan

This document tracks the recommendations for making the repository easy for judges to understand, run and evaluate.

## Priority levels

- **P0 — Submission blockers:** do before the final submission.
- **P1 — High impact:** strongly recommended before judging.
- **P2 — Polish:** useful if time remains.
- **P3 — Avoid unless required:** complexity that does not directly improve the demo.

## P0 — Submission blockers

| Item | Status | Action |
|---|---|---|
| Clear problem/solution pitch | Implemented | README leads with the student problem and C2C workflow |
| Working core flow | Implemented | Profile -> AI -> resume -> interview -> opportunities is documented |
| CI health | Implemented | GitHub Actions validates frontend and backend |
| Security baseline | Implemented | HttpOnly auth cookie, JWT checks, rate limiting, role checks and server-side AI key |
| Accurate opportunity sourcing | Implemented | NCS source metadata and failure handling |
| Honest AI disclosure | Implemented | See AI_USAGE.md |
| Known limitations | Implemented | See LIMITATIONS.md |
| 3-minute demo | Implemented | See docs/demo/demo-script.md |
| Real screenshots | Pending | Capture P0 screens into docs/screenshots/ |
| Demo recording | Pending | Record a 2-3 minute walkthrough |

## P1 — High impact

| Item | Status | Action |
|---|---|---|
| Architecture explanation | Implemented | See docs/architecture.md |
| AI usage explanation | Implemented | See AI_USAGE.md |
| Judge-friendly README | Implemented | Problem -> solution -> features -> demo -> architecture |
| Dependency reproducibility | Partial | Frontend lockfile exists; backend lockfile must be regenerated for the current dependency set |
| Repository topics/description | Pending | Add concise description and relevant topics in GitHub repository settings |
| Live deployment | Pending | Add a public demo URL only if a stable deployment is available |
| Feature screenshots | Pending | Add the P0/P1 screenshots |
| End-to-end test path | Partial | Add smoke tests for auth, AI fallback, resume parsing and opportunities |

## P2 — Polish

- Add a short demo GIF/video link to the README.
- Add a project architecture image in addition to Mermaid.
- Add a concise technology decision table.
- Add measurable impact metrics when real measurements are available.
- Add a sample student journey with clearly labeled illustrative data.
- Add issue labels/milestones for future engineering work.
- Add dependency/security scanning.

## P3 — Do not overbuild

Avoid adding technology just to make the stack look larger:

- Kafka
- Redis
- Kubernetes
- blockchain
- microservices
- multiple AI providers without a product reason
- generic chatbot features

The strongest narrative is the coherent employability loop:

**Student -> Assessment -> Skill Gap -> Action Plan -> Preparation -> Opportunity**

## Final judge checklist

Before submitting:

- [ ] README opens with the problem and one-line solution.
- [ ] A judge can understand the product in under 30 seconds.
- [ ] A judge can run the project from clean instructions.
- [ ] CI is green.
- [ ] No secrets or credentials are committed.
- [ ] Screenshots show real product screens.
- [ ] Demo follows one student persona.
- [ ] AI behavior is clearly explained.
- [ ] Limitations are honestly documented.
- [ ] Opportunity data shows its source.
- [ ] Demo URL is tested if provided.
- [ ] Video is tested from a fresh/private browser.
- [ ] Submission form, repository URL and demo URL all point to the final revision.
