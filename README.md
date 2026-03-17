# Qurafy

Next.js app with Better-Auth + Drizzle + Supabase Postgres.

## 1. Install

```bash
bun install
```

## 2. Configure environment

Copy `.env.example` to `.env.local` and fill the values.

```bash
cp .env.example .env.local
```

Required for auth + database:

- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- Database via one of:
  - `DATABASE_URL` (recommended)
  - or `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_DB_PASSWORD`

Important:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is for frontend Supabase usage.
- It is not used for server database connections.
- SMTP values are used to send password reset links.

## 3. Run database migration

```bash
bun run db:generate
bun run db:migrate
```

## 4. Run app

```bash
bun run dev
```
