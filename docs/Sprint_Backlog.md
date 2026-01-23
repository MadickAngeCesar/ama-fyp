# Sprint Backlog — 2-week MVP Sprint

Sprint Goal: Deliver a working MVP that allows authenticated students to submit and track complaints, interact with a basic AI chatbot (Gemini), and allows staff to triage and respond.

Sprint Duration: 2 weeks (10 working days)
Assumed team: 1 developer (you) + GitHub Copilot assistance
Planned capacity: ~40 hours/week (adjust to your availability). Target completion: core MVP stories.

Sprint Prioritized Stories (from Product Backlog)
- PB-001: Clerk authentication integration (3 SP)
- PB-011: Supabase + Prisma schema + migrations (3 SP)
- PB-002: Submit complaint API + frontend form (5 SP)
- PB-003: Student complaint list and status view (3 SP)
- PB-004: Staff list, update status, respond (5 SP)
- PB-007: Chat session basic flow (Gemini stub + backend) (5 SP)
- PB-008: Escalate chat -> create complaint (2 SP)
- PB-012: Deploy to Vercel and configure env (2 SP)
- PB-013: Basic tests for core endpoints (3 SP)
 - PB-014: Admin role assignment and user management (2 SP)
 - PB-015: Staff claim/unassign and internal notes (3 SP)
 - PB-016: Admin categories & priorities management (2 SP)
 - PB-017: Suggestion moderation (3 SP)
 - PB-018: Basic admin reporting (3 SP)
 - PB-019: User profile and activity (2 SP)
 - PB-020: Audit logging (2 SP)
 - PB-021: Search & Filter (3 SP)
 - PB-022: Data export & deletion (GDPR) (3 SP)
 - PB-023: AI rate-limiting & usage tracking (2 SP)
 - PB-024: AI safety & prompt redaction (3 SP)
 - PB-025: RTM & test mapping (1 SP)
 - PB-005: Suggestions feed & submit (3 SP)
 - PB-006: Suggestion upvote (2 SP)
 - PB-009: Generative UI prototype (3 SP)

Total planned: 31 SP (adjustable)

Sprint Tasks (grouped by story)

1) Setup & infra (Day 1)
- Task: Create Supabase project, enable Storage, Realtime; get DB connection string. (2h)
- Task: Create Clerk project/config, set redirect URIs. (1h)
- Task: Add environment vars to local .env and Vercel later. (1h)

2) Prisma & DB (Day 1-2)
- Task: Add Prisma schema (appendix A models), run `prisma migrate dev`. (4h)
- Task: Generate Prisma client. (1h)

2.1) DB extras (Day 2)
- Task: Add `AuditLog`, `ChatSession`, `Message`, and `UIPrototype` models to Prisma and run migration. (3h)

3) Auth integration (Day 2)
- Task: Integrate Clerk into Next.js app (server and client), map `clerkId` to `User` row. (6h)

4) Complaints API & Frontend (Day 3-6)
- Task: API: POST /api/complaints (validate, store, upload attachment to Supabase Storage). (6h)
- Task: API: GET /api/complaints (user-scoped). (3h)
- Task: Frontend complaint form with shadcn/ui components and file upload. (8h)

4.0) Suggestions (Day 4)
- Task: API: POST /api/suggestions and GET /api/suggestions (feed). (4h)
- Task: Frontend suggestions feed and submission form (shadcn/ui). (4h)
- Task: API: POST /api/suggestions/:id/upvote and client upvote handling. (3h)

4.3) Generative UI (Day 5)
- Task: API: POST /api/generate-ui to call Gemini (or stub) and save UIPrototype. (4h)
- Task: Client: request generative UI prototype and safely render JSON-backed prototype preview. (4h)

4.2) Search, Audit & GDPR (Day 5-6)
- Task: API: Add audit logging hooks for complaint/suggestion endpoints. (3h)
- Task: API: Implement basic search/filter endpoints and pagination. (4h)
- Task: API: Data export and deletion endpoints (GDPR). (4h)

4.1) Admin settings & user mgmt (Day 4-5)
- Task: API & UI: admin role assignment endpoints and simple user list. (4h)
- Task: API & UI: categories and priorities CRUD for complaint form. (4h)

5) Staff dashboard (Day 6-8)
- Task: API: GET /api/admin/complaints (filtering), PATCH /api/complaints/:id (status/response). (6h)
- Task: Staff UI list, detail view, status change UI. (8h)

5.1) Staff features (Day 7-8)
- Task: Implement claim/unassign endpoints and UI actions. (4h)
- Task: Internal notes support in API + UI (staff-only notes). (4h)

5.2) Moderation & Reporting (Day 8-9)
- Task: Implement suggestion moderation endpoints and moderation queue UI. (4h)
- Task: Implement admin reporting queries and simple visuals. (4h)

6) Chat prototype (Day 8-10)
- Task: POST /api/chat/sessions, POST /api/chat/sessions/:id/messages (server calls Gemini or stub). Implement prompt template, redaction, and rate limit. (8h)
- Task: Chat UI (simple message list, input, display AI response). (6h)
- Task: Escalation endpoint to create complaint from chat (2h)

6.1) AI safety & Rate-limits (Day 9)
- Task: Implement prompt redaction and store promptHash instead of raw prompt. (3h)
- Task: Implement per-user rate limiting and usage counters for AI calls. (3h)

6.1) Moderation & Reporting (Day 9)
- Task: API + UI: suggestion moderation endpoints and simple moderation queue UI. (4h)
- Task: API + UI: admin reporting queries (counts by status, top suggestions). (4h)

7) Deployment & Tests (Day 10)
- Task: Deploy to Vercel, set env vars for Clerk, Supabase, Gemini. (2h)
- Task: Add basic unit/integration tests for core APIs (3h)
- Task: Smoke test flows and create issues for remaining work (2h)

7.1) RTM & Test mapping (Day 10)
- Task: Produce RTM CSV/JSON linking FR IDs to PB IDs and create placeholder test case IDs. (2h)

8) Profile & UX polish (small, Day 10)
- Task: Profile page to update name/email and show recent activity. (3h)

Definition of Done (per story)
- Code pushed to feature branch with PR
- Unit/integration tests covering main logic
- End-to-end manual verification of critical flows
- Environment variables and secrets not committed
- Basic documentation updated (`README` or relevant docs)

Risks & Mitigations
- Gemini API quota/cost: start with a stub/mock for local dev; add conservative throttling and prompts that limit token usage.
- Supabase/Postgres connection issues: verify credentials early and keep migrations small.
- Clerk redirect misconfig: verify callback URLs in Clerk dashboard before testing auth flows.

Sprint ceremonies (suggested)
- Daily standup: 15 minutes (progress, blockers, plan)
- Sprint review: demo MVP at end of sprint
- Sprint retrospective: 30–45 minutes after review

Next steps after sprint
- Harden chatbot with better prompt engineering and session context
- Add suggestion moderation, analytics, and extended tests
- Improve UI/UX and accessibility compliance

Files: [docs/Sprint_Backlog.md](docs/Sprint_Backlog.md)
