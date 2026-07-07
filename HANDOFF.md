# WiE Academy — Project Handoff

_Last updated: 2026-07-07_

State of the project for the next developer: what's built, what's left, known bugs,
and open decisions. Items carry a marker:

- 🐛 **bug** · 🔧 **to build / wire up** · 🔍 **needs verification / testing** · ❓ **open decision** · ✅ **done**

## TL;DR

- **Health:** `pnpm ts-check` passes clean; `pnpm lint` passes with 0 errors, warnings only. App builds and runs.
- **Working modules:** auth (sign-up/in, email verification, password reset), announcements, events, forum, quizzes.
- **Top priorities:** admin-side UI + user approval (blocker — new users can't be approved in-app), then the dashboard (placeholder UI), content deletion, and per-field character limits.

## Tech stack

Next.js 16 (app router) · TypeScript · PostgreSQL + Prisma · better-auth · Resend ·
TipTap · shadcn/ui + Radix · Zod · TanStack Form · pnpm.

- Prisma schema: [prisma/models/](prisma/models/); client generated into `lib/generated/prisma`.
- Route protection: [proxy.ts](proxy.ts) (verify → approval → role gating).
- Server actions live in each feature's `actions.ts`.

---

## Auth & access control

- ✅ Approval status screens (pending / declined) — [app/auth/approval/page.tsx](app/auth/approval/page.tsx).
- 🔧 **Admin-side UI (blocker).** Nothing sets `approvalStatus` to `APPROVED`/`DECLINED`; there is no reviewer UI. New users are stuck `PENDING`. Needs an admin section (`/app/admin/...`) gated on `Role.ADMIN` with a pending-users queue (approve/decline + notify by email), plus user management for `ROUTES.USER_MANAGEMENT` (`/app/dashboard/students`).
  - _Interim workaround:_ approve manually in `pnpm db:studio` (`user.approvalStatus = 'APPROVED'`).
- 🐛 **Sign-up birth-date calendar** doesn't select the birth date properly — can't pick today's date when month/year are chosen from the dropdown. Needs thorough testing to verify the full fix. [sign-up form:287](app/auth/sign-up/_components/form.tsx#L287), shared [components/date-picker.tsx](components/date-picker.tsx).
- 🔧 **School list needs virtualization.** The sign-up school field uses the plain `Combobox` and loads the full school list at runtime ([sign-up form:236](app/auth/sign-up/_components/form.tsx#L236)). A [components/combobox-virtualized.tsx](components/combobox-virtualized.tsx) component already exists but is unused — swap it in.
- 🔍 **Email verification + password reset** (via forgot-password) need end-to-end testing to confirm behaviour.
- 🔧 **Route protection** in [proxy.ts](proxy.ts) will need updating once `/app/admin` pages are added.
- 🔧 **Verify-page session workaround** — [app/auth/verify/page.tsx:38](app/auth/verify/page.tsx#L38) manually creates the session post-verification; revisit for a cleaner better-auth approach.
- ❓ **Roles** — currently a flat `ADMIN` / `MEMBER` enum. Consider a better/more granular implementation (e.g. better-auth's admin plugin or scoped permissions).
- Minor auth-form TODOs: "Remember me" not implemented ([sign-in:137](app/auth/sign-in/_components/form.tsx#L137)); Privacy Policy / ToS links missing (sign-in & sign-up).

## Announcements

- ✅ List + filters (search, read status, date range), detail, create/edit (upsert), targeting (regions/schools/year levels), categories, read/unread tracking.
- 🔧 **Delete button for admins** — not implemented (see the shared soft-vs-hard-delete decision under _Shared_).
- 🔧 **Seed targeting** — the seeded announcements have no targeting data (`// TODO: add targeting`) — [prisma/seed/announcements.ts](prisma/seed/announcements.ts).

## Events

- ✅ List + filters, responsive detail, create/edit (upsert), register/unregister, capacity gauge, categories.
- 🔧 **Delete button for admins** — not implemented.
- 🔧 **QR code for attendance** — not implemented. Needs a check-in flow to mark members as attended (`EventParticipation` model + `ROUTES.EVENT_ATTENDANCE` = `/api/events/attendance` exist as stubs).
- 🔧 **View attendees** — the button is unwired ([detail.tsx:150](app/app/events/_components/detail.tsx#L150)). Should show registrations (and, once attendance exists, attendees).
- 🔧 **Convert dialogs to pages** — change the event detail dialog to a dedicated page (like announcements), and likewise move the create/edit dialogs to pages.
- 🐛 **Register button shows stale status** — [detail.tsx:204](app/app/events/_components/detail.tsx#L204). `handleRegisterClick` calls `router.refresh()` ([list.tsx:65](app/app/events/_components/list.tsx#L65)) but the open dialog reads `isRegistered`/`isAttended` from a stale local `event` snapshot that's never updated. (Converting the dialog to a page will likely resolve this.)
- ❓ **Google Maps integration** for the event location.

## Forum

- ✅ List + filters, post detail, create/edit posts (upsert), like + view tracking, categories.
- 🔍 **Private / anonymous posts** — functionality needs verification.
- 🐛 **Thread depth / nesting** — nested threads are not actually implemented; reply depth management was never resolved ([reply-list.tsx](app/app/forum/_components/reply-list.tsx), [reply-form.tsx](app/app/forum/_components/reply-form.tsx)). The schema supports `PostReply.parentId` self-relation, but the UI/behaviour needs designing and verifying.
- 🔧 **Delete post** — the "Delete Post" button is rendered but unwired (no `onClick`, no delete action) ([detail.tsx:94](app/app/forum/_components/detail.tsx#L94), [card.tsx:89](app/app/forum/_components/card.tsx#L89)). Wire it up to delete threads too — or change it to an **archive** button (ties into the soft-vs-hard-delete decision).
- 🔧 **Flag / report** — button not implemented; needs an admin-side UI to action reports.
- 🔧 **Profanity filter** — not implemented (this is the primary place it's needed; see _Shared_).

## Quizzes & surveys

- ✅ Quiz builder + attempt + results/scoring for **single-select, multi-select, and true/false** — confirmed fully functional for quizzes.
- ℹ️ **The quiz builder intentionally does not offer text / rating / scale questions.** Those types would require manual grading or grading automation, which was deemed out of scope for quizzes. `quizAllowedTypes` restricts the builder to the three scoreable types ([lib/constants/question-types.ts](lib/constants/question-types.ts)); `insertQuizResponse` only scores those three ([app/app/explore/quiz/actions.ts](app/app/explore/quiz/actions.ts)). This is by design, **not a bug.** The text/rating/scale question components exist so they can be **reused for surveys.**
- 🔍 **Verify text / rating / scale behaviour** (builder → attempt → persistence) before building surveys — this is the prerequisite for the survey work below.
- 🔧 **Surveys** — planned, not built. Intended mainly for **post-event surveys**, which can use **all 6 question types**. The data model is ready: `QuestionnaireType.SURVEY`, `surveyQuestionTypeOptions`, `ROUTES.EVENT_SURVEY`, the `SURVEY_SUBMITTER` badge, and the `Questionnaire → Event` link all exist. Build the survey builder/response flow (reusing the quiz components) once text/rating/scale are verified.

## Dashboard

- 🔧 **Not implemented — placeholder UI.** Every section of [app/app/dashboard/page.tsx](app/app/dashboard/page.tsx) is hardcoded mock data (stats, XP/level bar, achievements, announcements, upcoming events, "continue learning").
- 🔧 **Gamification (XP / levels / badges) backing is missing.** `User.experiencePoints` exists but is never written; [xp-values.ts](lib/constants/xp-values.ts) and [badge-ids.ts](lib/constants/badge-ids.ts) are only referenced in commented-out code ([events/list.tsx:44](app/app/events/_components/list.tsx#L44), [announcements/list.tsx:32](app/app/announcements/_components/list.tsx#L32)); there are **no `Badge` / `UserBadge` / level models** in the schema. Needs the models, XP-award logic on the relevant actions (create post/reply, complete onboarding, earn badge tier — see the `XP_VALUES` keys), then real dashboard wiring.

## Shared / editor / UX

- 🔧 **TipTap editor refactor** — carryover from the original project. Doesn't work well on mobile; replace the fixed toolbar with a **floating menu**. [components/editor/](components/editor/).
- 🔧 **Multi-select component** — rough implementation, could be improved. [components/form/shared/questionnaire/question.multi-select.tsx](components/form/shared/questionnaire/question.multi-select.tsx).
- 🔧 **Category badges have no icons** — [components/category-badge.tsx:14](components/category-badge.tsx#L14).
- ❓ **Content deletion (cross-cutting)** — not implemented anywhere because it was undecided whether to **soft-delete (with a flag)** or **hard-delete**. This decision gates the delete buttons for announcements, events, and forum posts. Consider soft-delete/archive for user-generated content.
- 🔧 **Profanity filter** — `bad-words` is a dependency but only referenced in commented-out code ([events form:27](app/app/events/_components/form.tsx#L27)). Implement it, primarily for the **forum**.
- 🔧 **Character limits** — text boxes and any bounded field need defined limits (e.g. character limits), none of which are set yet. See also _Infra_ (DB-level max lengths). Related TODOs: [sign-in:67](app/auth/sign-in/_components/form.tsx#L67), [sign-up:103](app/auth/sign-up/_components/form.tsx#L103).
- ⏸️ **Dark mode — deliberately not wired.** Stakeholders explicitly wanted light mode only. `next-themes` is installed and `dark:` classes exist, but there's no `ThemeProvider`/toggle on purpose. Defer unless stakeholders change their mind.

## Infra & storage

- 🐛 **Supabase connection pooling** — the DB throws "max connection limit reached" once more than one user connects. The pooled `DATABASE_URL` needs fixing (use the Supabase pooler/pgBouncer URL and appropriate connection limits). N/A if the DB moves off Supabase to plain Postgres.
- 🔧 **Max character length on text fields** — no defaults set at the DB/schema level; define them (pairs with the UI character-limit work in _Shared_).
- 🔧 **File storage** — images / documents / videos have nowhere to live yet. Pick a backend (Supabase Storage, git-LFS, or Cloudflare R2) and, ideally, build it **modular/swappable between services** — mirroring how the Prisma schema abstracts the DB provider.

---

## Other unbuilt routes / pages

Route constants exist in [lib/constants/routes.ts](lib/constants/routes.ts) with no page or handler behind them:

- 🔧 **Profile page** (`ROUTES.PROFILE` → `/app/profile`) — user profile view/edit; not built.
- 🔧 **`REPORT`, `CHAT`, `LOGOUT`** — route constants defined but unbuilt.
- _(`USER_MANAGEMENT`, `EVENT_SURVEY`, and `EVENT_ATTENDANCE` are tracked under Auth, Quizzes & surveys, and Events respectively.)_

---

## Config & tooling hygiene

- ✅ `package.json` script fixes applied.
- 🔧 **`EVENT_JWT_SECRET`** (in `.env`) is a leftover from the old Supabase setup — unused in code, safe to remove.
- 🔧 **No test infrastructure** — no vitest/jest/playwright, though CONTRIBUTING references tests (`[TEST]`). Stand up from scratch if tests are expected.
- 🔧 **Error logging** — `app/error.tsx` and `app/app/error.tsx` have `// TODO: Log the error to an error reporting service`; no Sentry/equivalent wired up.
- Minor: leftover `console.log` in [events/form.tsx:38](app/app/events/_components/form.tsx#L38) and [editor/toolbar-items/mark.tsx:56](components/editor/toolbar-items/mark.tsx#L56); `==` vs `===` at [components/ui/field.tsx:196](components/ui/field.tsx#L196); raw `<img>` on the landing page.

## Seeding & local accounts (gotcha)

`pnpm db:seed` creates reference data plus two sample users (Alice = `ADMIN`, Bob),
but those rows set **no password/account, no `emailVerified`, and no
`approvalStatus`** ([prisma/seed.ts](prisma/seed.ts)) — so seeded accounts **cannot
sign in** and would fail the proxy's verify + approval gates anyway. To get a working
account today: register through the UI (completes email verification), then set
`approvalStatus = 'APPROVED'` (and `role = 'ADMIN'` if needed) in `pnpm db:studio`.

---

## What's built and working

- **Auth:** sign-up, sign-in, email verification, forgot/reset password (better-auth + Resend), route protection.
- **Announcements:** list, filters, detail, create/edit, targeting, categories, read/unread tracking.
- **Events:** list, filters, detail, create/edit, register/unregister, capacity gauge, categories.
- **Forum:** posts, replies, like/view tracking, anonymous & private posts, categories. _(nesting, delete, flag, profanity still open)_
- **Quizzes:** builder + attempt + scoring for single-select / multi-select / true-false.
- **Shared:** TipTap editor, email templates (+ `pnpm email:dev`), not-found/error/unauthorized pages, reusable form kit, seeds.
