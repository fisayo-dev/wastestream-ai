import { pool } from "./index";

let ensured = false;

export async function ensureAuthSchema() {
  if (ensured) {
    return;
  }

  const result = await pool.query<{
    table_name: string;
  }>(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('user', 'session', 'account', 'verification');
  `);

  if (result.rows.length < 4) {
    throw new Error(
      "Auth tables are missing. Run `npm run db:push` for local sync or `npm run db:migrate` after generating migrations.",
    );
  }

  ensured = true;
}
