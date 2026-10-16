# Phase 2: Events and administration

The existing Next.js application remains the only backend. Public visitors need no accounts. No signup route is provided. All content starts empty; existing photography has not been assigned invented event names.

## 1. Create and configure Supabase

Create a project at https://supabase.com/dashboard and keep its database password private. In Authentication → Providers → Email, disable **Allow new users to sign up**. Configure the production Site URL in Authentication → URL Configuration. Password authentication uses server actions; no callback route is needed. Keep Supabase Auth rate limits enabled.

## 2. Apply the schema

Run `supabase/migrations/202610150001_events.sql` once in the project's SQL Editor, or apply it using the Supabase CLI migrations workflow. It creates:

- `events`: unique validated slug, date/time and location fields, descriptions, registration URL, featured flag, publication status and timestamps. An update trigger maintains `updated_at` and sets the initial `published_at` on publication.
- `event_images`: storage paths, image URL field, alt text, caption and sort order; deleting an event cascades its gallery records.
- `admin_users`: an administrator allowlist keyed to `auth.users`. It is managed by the project owner through SQL, never through public application APIs.
- Date/status indexes, RLS policies, and the `is_admin()` permission helper with a fixed search path.

RLS allows anonymous and ordinary authenticated users to read only published events and their gallery records. Authorized administrators have CRUD rights. Draft and cancelled events are excluded from public queries explicitly and by RLS. Public reads use an anonymous client even if the visitor has an admin cookie.

## 3. Storage

The migration creates **event-images**, a **private** bucket accepting JPEG, PNG and WebP, with a 10 MB per-file limit. Do not change it to public: public buckets bypass read authorization and could expose draft photography.

Paths are `events/{event-id}/cover/{uuid}.{ext}` and `events/{event-id}/gallery/{uuid}.{ext}`. Only allowlisted administrators can upload or delete. Public read policy permits signed URLs only for objects referenced by a published event or its gallery. The application creates one-hour signed URLs at request time; reload a page to renew expired URLs. Previously issued URLs remain usable until expiry after unpublishing. Uploaded images use direct signed image URLs to avoid a public optimization cache retaining private images. Repository images still use Next.js optimization.

Do not add broad authenticated-user policies. The migration includes all required bucket policies; it must run with project-owner privileges.

Admin deletion removes the event's cover and gallery objects, including interrupted uploads, then deletes the event and cascades its gallery rows. Storage and PostgreSQL are not a distributed transaction: if deletion fails partway, retry it. Direct SQL deletion only cascades database records, so manually remove that event's storage folder if bypassing the admin UI. Replacing a cover attempts to remove the old file. Failed uploads attempt cleanup and report errors.

## 4. Environment

Copy `.env.example` to `.env.local` and replace:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
EVENTS_TIME_ZONE=America/Denver
```

Find the URL and publishable key in the project's Connect dialog / API settings. The publishable key is designed to be public; security comes from RLS. No service-role key, secret API key or database password is needed by this application. Never put those secrets in `NEXT_PUBLIC_*` variables. `.env.local` is ignored by Git. Set the same variables on your Next.js host and redeploy.

Dates switch between upcoming and past at midnight in `EVENTS_TIME_ZONE`. Multi-day events remain upcoming through their end date. Enter event times in the venue's local time; the detail page labels this explicitly.

## 5. Create the first administrator

In Supabase Authentication → Users, add the owner's email/password account and confirm the email using dashboard controls. Copy the user's UUID. In the SQL Editor run:

```sql
insert into public.admin_users(user_id) values ('REPLACE_WITH_AUTH_USER_UUID');
```

Visit `/admin/login` and sign in. A normal authenticated account is not an administrator. To revoke an administrator, delete its `admin_users` row. Server actions and database/storage policies check the live allowlist, so revocation does not rely on hiding links or waiting for a role claim to expire. Account/password recovery is performed through the Supabase dashboard for this initial release.

## 6. Local use

```sh
npm install
npm run dev
```

Open the printed localhost URL. Use `npm run lint`, `npm run test:events`, and `npm run build` for checks, then `npm start` to serve a production build. The public site renders intentional empty states without configured variables; admin sign-in clearly reports missing configuration. A configured project that fails queries shows a retry screen rather than pretending that no events exist.

Next.js 16 `src/proxy.ts` refreshes cookies and checks admin requests. The protected admin layout and every mutation separately validate the user with Supabase Auth and check `is_admin()`. Mutations use same-origin Next.js Server Actions with a 12 MB request limit, allowing one 10 MB photograph plus multipart overhead. Multi-file galleries upload sequentially. Adjust any hosting request-size limit to support this size (otherwise lower both application and bucket limits).

SSR approach: https://supabase.com/docs/guides/auth/server-side/creating-a-client

## 7. Owner workflow

Create an event at `/admin/events/new`, check its generated slug, and save a draft or publish. Save a new event before adding gallery photographs. On the edit page, upload multiple photographs, add alt text/captions, and set numeric order. Existing files from `images spc` or `public/images/scs` can be selected manually for upload. Use historical dates for archives; do not invent event facts.

Draft removes an event from public view; cancelled also hides it, as requested by the published-only policy. Dates automatically determine the past catalog; there is no separate archive status. Permanent deletion asks for confirmation. Published rows link to the public detail page; drafts are reviewed in the editor. The upcoming list and archive paginate; the calendar shows the next 1,000 upcoming events, with a notice if more exist.

## Required live acceptance checks after setup

Use a disposable event and two accounts (allowlisted admin and ordinary authenticated user). Never use production content for destructive checks.

1. Signed out: `/`, `/events`, `/shop`, `/contact`, `/admin/login` load; `/admin`, `/admin/events`, `/admin/events/new`, and an edit URL redirect to login.
2. Sign in as an ordinary user: admin access and all table/storage mutations must fail. Public reads still return only published content. Verify this through Supabase API calls as well as the UI.
3. As admin, create a draft with a unique title and slug and upload cover/gallery images. In a separate signed-out session, the draft slug returns 404, it never appears in lists/calendar/home, and signing a draft-photo URL is denied.
4. Publish: verify homepage next-event card, upcoming list, calendar, detail, registration link, gallery lightbox (Escape/arrows/focus return), and anonymous photo viewing. Verify publication timestamp in SQL.
5. Edit dates into the past: verify movement into archives. Test a multi-day event spanning months. Test duplicate slugs, invalid dates/times/URLs, unsupported file types and oversized images.
6. Save draft and cancel: verify public disappearance. Previously issued signed URLs expire within one hour.
7. Edit image descriptions/order; delete a photo with confirmation. Delete the disposable event and verify its gallery rows and storage folder are gone.
8. Sign out, verify protected redirects, revoke an admin and verify immediate denial. Check mobile navigation, month agenda, forms, uploads and gallery on a real phone.

Automated checks do not replace live RLS/Storage tests. These require a configured Supabase project; no real credentials are included in the repository.
