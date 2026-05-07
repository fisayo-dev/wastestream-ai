import { pool } from "./index";

let ensured = false;

export async function ensureAuthSchema() {
  if (ensured) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "emailVerified" boolean NOT NULL DEFAULT false,
      "image" text,
      "createdAt" timestamptz NOT NULL,
      "updatedAt" timestamptz NOT NULL
    );
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique"
    ON "user" ("email");
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY,
      "expiresAt" timestamptz NOT NULL,
      "token" text NOT NULL,
      "createdAt" timestamptz NOT NULL,
      "updatedAt" timestamptz NOT NULL,
      "ipAddress" text,
      "userAgent" text,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "session_token_unique"
    ON "session" ("token");
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS "session_userId_idx"
    ON "session" ("userId");
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY,
      "accountId" text NOT NULL,
      "providerId" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accessToken" text,
      "refreshToken" text,
      "idToken" text,
      "accessTokenExpiresAt" timestamptz,
      "refreshTokenExpiresAt" timestamptz,
      "scope" text,
      "password" text,
      "createdAt" timestamptz NOT NULL,
      "updatedAt" timestamptz NOT NULL
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS "account_userId_idx"
    ON "account" ("userId");
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "account_provider_account_unique"
    ON "account" ("providerId", "accountId");
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" timestamptz NOT NULL,
      "createdAt" timestamptz NOT NULL,
      "updatedAt" timestamptz NOT NULL
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS "verification_identifier_idx"
    ON "verification" ("identifier");
  `);

  ensured = true;
}
