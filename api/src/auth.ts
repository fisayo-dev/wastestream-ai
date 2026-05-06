import { betterAuth } from "better-auth";

import { pool } from "./database/index.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const port = Number(process.env.PORT ?? 2300);
const baseURL = process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`;
const frontendURL = process.env.FRONTEND_URL ?? "http://localhost:2900";

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are not configured");
}

export const auth = betterAuth({
  database: pool,
  baseURL,
  trustedOrigins: [frontendURL],
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      prompt: "select_account",
    },
  },
});

export { frontendURL };
