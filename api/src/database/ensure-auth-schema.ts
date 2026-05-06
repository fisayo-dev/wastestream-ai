import { getMigrations } from "better-auth/db/migration";

import { auth } from "../auth.js";

let ensured = false;

export async function ensureAuthSchema() {
  if (ensured) {
    return;
  }

  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  ensured = true;
}
