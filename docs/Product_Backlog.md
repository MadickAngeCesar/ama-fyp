# Product Backlog — MVP (2 weeks)

Project: AI-powered Student Support System (ASSS)
Scope: MVP to support student complaints, suggestions, and student inquiries (chatbot + simple generative UI), staff triage, and real-time updates.

Priority ordering (top = highest priority)

## Epics & User Stories (MVP-focused)

Epic: Authentication & Users
- PB-001: As a user, I can sign up and sign in using Clerk so I can securely access the system. (Priority: High, Estimate: 3 SP)
  - Acceptance: Clerk auth integrated; user record saved with `clerkId`; role mapping works.

Epic: Complaints
- PB-002: As a student, I can submit a complaint with category, description, and an optional attachment. (High, 5 SP)
  - Acceptance: Complaint stored in DB, attachment saved to Supabase Storage, response contains created id.
- PB-003: As a student, I can view my submitted complaints and their status. (High, 3 SP)
  - Acceptance: Student sees own complaints; statuses update in UI.
- PB-004: As staff, I can list complaints, change status, and add a response. (High, 5 SP)
  - Acceptance: Staff endpoints update status/response and student receives notification.

Epic: Suggestions
- PB-005: As a student, I can submit suggestions and view suggestions feed. (Medium, 3 SP)
- PB-006: As a user, I can upvote a suggestion once. (Medium, 2 SP)

Note: Suggestions are part of the MVP scope and appear in the sprint backlog as PB-005 and PB-006.

Epic: Student Inquiries (Chatbot & Generative UI)
- PB-007: As a student, I can start a chat session with an AI chatbot (Gemini) for quick answers. (High, 5 SP)
  - Acceptance: Chat session created, messages exchanged via backend, AI replies returned.
- PB-008: As a student, I can escalate a chat into a complaint (auto-fill form). (High, 2 SP)
  - Acceptance: Escalation creates complaint prefilled with context from chat.
- PB-009: As a student, I can request a generated UI hint (e.g., suggested FAQ card) and view a sanitized JSON-backed prototype. (Medium, 3 SP)
  - Acceptance: Backend returns JSON schema, preview path optional; client renders using safe schema.

Note: Student Inquiries (PB-007..PB-009) are scheduled in the sprint backlog and include chat sessions, escalation, and generative UI prototype features.

Epic: Realtime & Notifications
- PB-010: As a student, I receive realtime updates when my complaint status changes. (Medium, 3 SP)
-
Epic: Staff & Admin Management
- PB-014: As an admin, I can assign `STAFF` roles to users and revoke roles so staff access is controlled. (High, 2 SP)
  - Acceptance: Admin UI to assign/revoke roles; role changes reflected in Clerk-linked user records and enforce RBAC.
- PB-015: As staff, I can claim/unassign complaints and add internal notes visible only to staff. (High, 3 SP)
  - Acceptance: `assigneeId` updated; internal notes stored with `isInternal` flag; students cannot see internal notes.
- PB-016: As an admin, I can manage categories and priorities used when creating complaints. (Medium, 2 SP)
  - Acceptance: Admin settings page to add/edit/delete categories; categories used in complaint form.

Epic: Moderation & Reporting
- PB-017: As staff/admin, I can moderate suggestions (approve/reject) and flag abusive content. (Medium, 3 SP)
  - Acceptance: Moderation endpoints + UI; flagged items hidden from public feed until reviewed.
- PB-018: As an admin, I can view basic reports (counts by status, top suggestion upvotes) for last 30 days. (Medium, 3 SP)
  - Acceptance: Simple report page that queries DB and visualizes counts.

Epic: Data & DevOps
- PB-011: Set up Supabase, Prisma schema, and migrations for MVP. (High, 3 SP)
- PB-012: Deploy Next.js app to Vercel with environment variables for Clerk, Supabase, Gemini. (High, 2 SP)

Epic: Testing & Quality
- PB-013: Add basic unit tests and API integration tests for core endpoints. (Medium, 3 SP)

## Backlog Notes
- SP = story points (relative sizing). Adjust as team learns.
- MVP target: complete PB-001..PB-004, PB-007, PB-008, PB-011, PB-012 within sprint.
- Non-MVP items (defer): advanced analytics, suggestion moderation UI, multi-language.

## Coverage Mapping
These backlog items map to the SRS functional requirements (FR-xxx):
- FR-001 Authentication -> PB-001
- FR-002 Submit Complaint -> PB-002
- FR-003 Track Complaint Status -> PB-003 / PB-010
- FR-004 Submit Suggestion -> PB-005
- FR-005 Upvote Suggestions -> PB-006
- FR-006 Chatbot Interaction -> PB-007
- FR-011 Student Inquiries (generative UI) -> PB-009
- FR-007 Staff Dashboard -> PB-004 / PB-015
- FR-008 Real-time Notifications -> PB-010
- FR-009 Audit Logging -> PB-020 (below)
- FR-010 Search & Filter -> PB-021 (below)

## Additional Technical & Compliance Stories
- PB-020: Audit logging — Record create/update/delete actions for complaints, suggestions and chat escalations. (Medium, 2 SP)
  - Acceptance: AuditLog entries created for CRUD actions with actorId, action, entity, entityId, timestamp; admin query endpoint exists.
- PB-021: Search & Filter — Staff can search complaints/suggestions by keywords, date ranges, category, status, and user. (Medium, 3 SP)
  - Acceptance: API supports search params; results paginated and return within NFR targets.
- PB-022: Data export & deletion (GDPR) — Users can request export or deletion of their PII and content. (High, 3 SP)
  - Acceptance: Export endpoint returns user data JSON; deletion anonymizes or removes PII and records deletion event in AuditLog.
- PB-023: Rate-limiting & cost control for AI calls — Implement per-user throttling and usage tracking to avoid runaway Gemini costs. (High, 2 SP)
  - Acceptance: Backend enforces limit (e.g., 5 AI calls/min, 500/month default), returns 429 when exceeded, and logs usage.
- PB-024: AI safety, prompt redaction & logging — Redact PII before sending to Gemini, log prompt hash and response metadata only. (High, 3 SP)
  - Acceptance: Prompt redaction implemented; redacted content sent; raw PII not stored; promptHash stored in UIPrototype/AiResponse.
- PB-025: RTM & Test mapping — Produce RTM CSV/JSON mapping SRS requirements to backlog items and initial test case IDs. (Low, 1 SP)
  - Acceptance: RTM file in `docs/` linking FR IDs to PB IDs and placeholder test IDs.

---

File: [docs/Product_Backlog.md](docs/Product_Backlog.md)
