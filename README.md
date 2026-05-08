# WasteStream AI

An AI marketplace for recyclable wastes — connecting waste providers with recyclers and enabling waste recognition with AI.

## Table of Contents

- About
- Features
- Tech stack
- Quick start (development)
- Environment
- Database & migrations
- Scripts
- Notable files
- Contributing
- License

## About

WasteStream AI is a full-stack hackathon project (Lablab AI × AMD Developer Cloud) that provides an interface for waste providers and recyclers and includes AI-assisted recognition of waste materials.

**Maintainer:** Fisayo Obadina (solo developer)

## Features

- User authentication (Google OAuth via Better Auth)
- PostgreSQL-backed data with Drizzle ORM schema + migrations
- Next.js frontend with TypeScript and Tailwind CSS
- Express + TypeScript API with auth and health routes

## Tech stack

- Frontend: Next.js (React) + TypeScript
- Backend: Express + TypeScript
- Database: PostgreSQL + Drizzle ORM
- Auth: Better Auth (Google OAuth)

## Quick start (development)

Prerequisites

- Node.js (v18+ recommended)
- npm (or pnpm/yarn)
- PostgreSQL (local or remote)

Install dependencies

```bash
# From repo root
cd api
npm install

cd ../web
npm install
```

Create env files

- Create an `.env` (or set env vars) for each workspace package. Example values below.

API example: `api/.env` (export or create file)

```env
DATABASE_URL=postgres://user:password@localhost:5432/wastestream
PORT=2300
FRONTEND_URL=http://localhost:2900
BETTER_AUTH_URL=http://localhost:2300/v1
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Frontend example: `web/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:2300/v1
```

Run database migrations (API)

```bash
cd api
# Sync schema for development
npm run db:push

# Or run migrations if you generate them
npm run db:migrate
```

Start the apps

```bash
# API (development, nodemon + ts-node)
cd api
npm run dev

# Web (Next.js)
cd ../web
npm run dev
# Frontend typically runs on http://localhost:2900
# API typically runs on http://localhost:2300
```

## Environment variables (summary)

- `DATABASE_URL` — PostgreSQL connection string (required for API)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `BETTER_AUTH_URL` — Base URL used by Better Auth (usually API public URL)
- `PORT` — API port (default: `2300`)
- `FRONTEND_URL` — Frontend URL for CORS/config (default: `http://localhost:2900`)
- `NEXT_PUBLIC_BACKEND_URL` or `NEXT_BACKEND_PUBLIC_URL` — Frontend -> backend URL

Check the code in [api/src/constants/general.ts](api/src/constants/general.ts#L1) and [web/proxy.ts](web/proxy.ts#L1) for places these values are read.

## Database & migrations

- Migrations are located in the `api/migrations/` directory. Two example migrations are present: `0000_unusual_kulan_gath.sql` and `0001_jittery_black_bolt.sql`.
- Drizzle Kit configuration is at [api/drizzle.config.ts](api/drizzle.config.ts#L1).
- Typical flow:
  - Set `DATABASE_URL`
  - `cd api && npm run db:push` (sync schema for development)
  - Or generate and run migrations with `npm run db:generate` and `npm run db:migrate`

Note: The API includes startup validation to ensure auth tables exist ([api/src/database/ensure-auth-schema.ts](api/src/database/ensure-auth-schema.ts#L1)).

## Useful scripts

API (in `api`)

- `npm run dev` — Start dev server with nodemon/ts-node (watch)
- `npm run build` — Compile TypeScript to `dist/`
- `npm run start` — Start compiled API (`node dist/server.js`)
- `npm run db:generate` — Drizzle migrate generate
- `npm run db:push` — Drizzle sync/push schema
- `npm run db:migrate` — Run pending migrations
- `npm run db:studio` — Launch Drizzle Studio (if configured)

Web (in `web`)

- `npm run dev` — Start Next.js dev server (default port used in project: `2900`)
- `npm run build` — Next.js production build
- `npm run start` — Start Next.js production server
- `npm run lint` — Run ESLint

If you need exact scripts, see `api/package.json` and `web/package.json`.

## Notable files

- API entrypoint: [api/src/server.ts](api/src/server.ts#L1)
- Drizzle config: [api/drizzle.config.ts](api/drizzle.config.ts#L1)
- Auth utilities: [api/src/lib/auth.ts](api/src/lib/auth.ts#L1)
- DB schema: [api/src/database/schema.ts](api/src/database/schema.ts#L1)
- Ensure auth schema on startup: [api/src/database/ensure-auth-schema.ts](api/src/database/ensure-auth-schema.ts#L1)
- Next.js root layout: [web/app/layout.tsx](web/app/layout.tsx#L1)
- Frontend proxy/middleware: [web/proxy.ts](web/proxy.ts#L1)
- Dashboard plan / product spec: [dashboard-plan.md](dashboard-plan.md#L1)

## Contributing

- Open an issue or submit a PR to the repository.
- For local development, follow the Quick start steps above.
- Keep changes focused; add tests where applicable.

## License

This project is provided under the MIT License.

---

If you'd like, I can:

- add a `web/.env.example` and `api/.env.example` file with the values above, or
- generate a short `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md`.

What would you like me to do next?
