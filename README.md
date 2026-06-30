# ArenaX Backend

Production Express/PostgreSQL backend for ArenaX Esports.

## Run locally

1. Copy `.env.example` to `.env` and set secure secrets.
2. Start Postgres and API:

```bash
docker compose up --build
```

API: `http://localhost:4000/api`
Swagger: `http://localhost:4000/api/docs`

## Main commands

```bash
npm install
npm run prisma:dev
npm run dev
```

No users, wallets, tournaments, or admin accounts are seeded. Register through `/api/auth/register`; users are created with role `user`, zero wallet/stat values, and `verified=false`.
