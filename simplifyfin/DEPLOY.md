# Deploy BudgetFreely (Vercel + Porkbun + Google)

## 1. Deploy to Vercel

1. Push the repo to GitHub
2. [vercel.com/new](https://vercel.com/new) → import the repo
3. **Root Directory:** `simplifyfin`
4. Framework: Next.js (auto)
5. Add env vars (Production + Preview as needed):

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Supabase transaction pooler |
| `DIRECT_URL` | Supabase direct / session |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (set after DNS) |
| `AUTH_EMAIL_ALLOWLIST` | optional, comma-separated |

6. Deploy — you’ll get `https://<project>.vercel.app`

Temporarily set:

- Supabase Site URL → `https://<project>.vercel.app`
- Redirect URL → `https://<project>.vercel.app/auth/callback`
- `NEXT_PUBLIC_SITE_URL` → same Vercel URL

You can finish Google auth on the Vercel URL **before** Porkbun if you want.

## 2. Point Porkbun at Vercel

In Vercel → Project → Settings → Domains → add your domain.

In Porkbun DNS (use the records Vercel shows; typical pattern):

**Apex (`yourdomain.com`):**
- A → `76.76.21.21` (Vercel)

**or subdomain (`app.yourdomain.com`):**
- CNAME → `cname.vercel-dns.com`

Wait for SSL to become valid in Vercel.

## 3. Finish Google auth

### Google Cloud OAuth client
Authorized redirect URI (Supabase, not your domain):

```
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

### Supabase → Authentication → URL configuration
- **Site URL:** `https://yourdomain.com`
- **Redirect URLs:**
  - `https://yourdomain.com/auth/callback`
  - `http://localhost:3000/auth/callback` (local)

### Vercel env
Update `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and redeploy.

## 4. Smoke test

1. Open `https://yourdomain.com` → landing page
2. Sign in with Google
3. Land on `/home` (welcome placeholder)
4. Add an account + transaction

Then return to Phase 1 features: CSV → analytics → recurring → SimpleFIN.
