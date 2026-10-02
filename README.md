# Tahwissa

Tahwissa is a tourism marketplace for exploring Algerian tours, meeting guides and agencies, requesting bookings, and sharing travel stories. It has a React/Vite frontend, an Express API, and a Supabase PostgreSQL database.

## Run locally

Use Node 20 or newer. Install dependencies in the repository root and in `backend/`:

```sh
npm install
cd backend && npm install
```

Copy `.env.example` to `.env`, and `backend/.env.example` to `backend/.env`. Set `VITE_API_URL` to the backend URL. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, and `FRONTEND_URL` in the backend environment. Never put the service role key in a `VITE_` variable or commit it.

In separate terminals, run `npm run dev` from the root and `npm start` from `backend/`. The local defaults are `http://localhost:5173` and `http://localhost:5000`.

`scripts/recreate_database.sql` builds a **new, empty** database with sample accounts. It drops application tables and must not be run against an existing deployment. For a database already created with the original reconstruction script, run the non-destructive `scripts/harden_existing_database.sql` in the Supabase SQL Editor. That script enables RLS, revokes direct client table access, reconciles post like counts, and makes the verification documents bucket private.

Run `scripts/audit_live_database.sql` in the Supabase SQL Editor to check the 16 expected tables, RLS state, the `fk_traveller_user` constraint, storage buckets, and schema naming quirks. The maintainer ran the hardening migration and shared an audit on 2026-10-02 in which every check passed. Re-run the audit after future schema or storage changes.

Create these Supabase Storage buckets if missing: public `tour-images`, `post-images`, `traveller-profiles`, and `agency-images`; private `verification-docs`. Only the backend should use the Supabase service role key. Verification documents are served to administrators with short-lived signed URLs.

## Deploy

- **Render:** deploy `backend/` as the root directory, with `npm install` as the build command and `npm start` as the start command. Set the backend environment variables above. `FRONTEND_URL` must contain the exact Vercel origin and any preview origins you intend to test.
- **Vercel:** deploy the repository root as a Vite project. `vercel.json` proxies `/backend/*` to the public Render API and rewrites other client routes to the SPA entry point. The production frontend calls `/backend`, so its session cookie stays on the Vercel origin. If the Render service URL changes, update the proxy destination in `vercel.json`. `VITE_API_URL` is used for local development only.

Rebuild and redeploy both services after changing environment variables. The backend cookie uses `SameSite=None; Secure` in production, so the deployed frontend and backend must both use HTTPS.
Deploy Render first, then Vercel: the updated frontend restores sessions through the new `/auth/session` backend endpoint.

## Portfolio demo accounts

The **new database** seed script creates `traveler@tahwissa.com`, `guide@tahwissa.com`, `agency@tahwissa.com`, and `admin@tahwissa.com`, all with the initial password `password123`. Change or rotate these passwords before exposing real personal data. The non-destructive migration does not create or reset accounts.

Sample tour dates are set relative to the day the database was created. Run `scripts/refresh_demo_tour_dates.sql` when those four sample dates expire; it updates only expired rows with the original seed titles. The API rejects booking requests for past tour dates.

## Current scope

Working areas include email/password authentication, tour browsing and detail pages, booking requests, community posts, provider tour management, employee management, reviews, and admin verification/report workflows. Google sign-in, payment plans, and the old notification/payment/privacy settings were removed from the live interface because no verified backend flow existed for them.

Run `npm run build` to type-check and bundle the frontend. `npm run lint` still reports legacy style and React lint violations across the original codebase; the production build is the release gate used here.

The provided `report.md` documents the original reverse engineering and redeployment work. Its advice to disable RLS and make `verification-docs` public is superseded by the migration and deployment instructions above.
