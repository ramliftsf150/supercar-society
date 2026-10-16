# Phase 2 verification — October 15, 2026

Passed against the final local production build:

- `npm run lint`
- `npm run build` (includes TypeScript checking)
- `npm run test:events`: 6 tests covering valid drafts, slug generation, unsafe URLs/invalid fields, chronological validation, multi-day classification, and date/time formatting.
- `git diff --check`
- `node tests/routes.mjs` against a local production server without Supabase credentials:
  - `/`, `/events`, `/shop`, `/contact`, `/admin/login`: HTTP 200.
  - `/admin`, `/admin/events`, `/admin/events/new`, and an edit URL: HTTP 307 to `/admin/login`.
  - `/events/not-a-real-event`: HTTP 404.
  - Existing homepage heading and honest Events empty state remain present.

The production build required network access for the site's pre-existing Google Geist font. It reports an existing metadataBase warning because a production origin has not been configured.

Limits: no Supabase credentials were provided, so migrations were not applied and live login, CRUD, draft isolation, Storage RLS and upload tests were not executed. Follow the acceptance checks in SUPABASE_SETUP.md after configuring the project. Code implements both explicit published-only anonymous queries and published-only RLS policies; their live enforcement still needs verification against the deployed database.

The in-app Browser failed during initialization with `Cannot redefine property: process`. Browser screenshots, mobile layout and interactive keyboard checks were therefore not completed. HTTP checks verify routing/content and build integrity, not visual correctness.
