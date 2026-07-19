# BudgetFreely

Open-source personal finance: bank sync, CSV import, analytics, and first-class **EMI + subscription** tracking.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- **Supabase Postgres** + Prisma 7 (`@prisma/adapter-pg`)
- **Supabase Auth — Google Sign-In** (primary)
- Auth.js magic link via Gmail (kept in repo for later)

## Phase 1 status

- [x] App scaffold, auth, schema, money helpers, shell UI
- [x] Accounts + manual transactions
- [x] Google Sign-In via Supabase
- [x] Landing page
- [ ] CSV import (Apple Card)
- [ ] SimpleFIN sync (Chase / WF)
- [ ] Analytics dashboard
- [ ] Recurring / EMI detector

## Setup

```bash
cd simplifyfin
cp .env.example .env
# Fill DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Supabase Google Sign-In

1. Supabase → **Authentication → Providers → Google** → enable
2. In [Google Cloud Console](https://console.cloud.google.com/) create an OAuth client (Web)
3. Authorized redirect URI (this is the important GCP redirect):
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
4. Paste Client ID + Secret into Supabase Google provider
5. Supabase → **Authentication → URL configuration**:
   - Site URL: `http://localhost:3000` (later your Porkbun domain)
   - Redirect URLs: `http://localhost:3000/auth/callback` (+ production URL when ready)
6. App `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
   - optional `AUTH_EMAIL_ALLOWLIST=you@gmail.com`

Porkbun domain later: point DNS at Vercel, then set Site URL + redirect URLs + `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com`.

### Supabase database

1. Create a project at [supabase.com](https://supabase.com)
2. `DATABASE_URL` = transaction pooler (`:6543`, `?pgbouncer=true&connection_limit=1`)
3. `DIRECT_URL` = direct / session (`:5432`) for migrations
4. App tables live in private schema **`app`**

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel + Porkbun + Google OAuth.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local app |
| `npm run build` | Production build |
| `npx prisma migrate dev` | Apply schema |
| `npx prisma studio` | Browse data |

## Naming

**BudgetFreely** is the product. App code lives in the `simplifyfin/` folder (Vercel root directory) — rename later if you want; no need to change deploy root mid-flight.
