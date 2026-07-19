# BudgetFreely

Web app lives in [`simplifyfin/`](./simplifyfin).

```bash
cd simplifyfin
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

See [`simplifyfin/README.md`](./simplifyfin/README.md) for setup and [`simplifyfin/DEPLOY.md`](./simplifyfin/DEPLOY.md) for Vercel + Porkbun + Google auth.
