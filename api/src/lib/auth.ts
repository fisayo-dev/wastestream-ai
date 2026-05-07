import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { config } from "dotenv";

import { db } from "../database/index";
import * as schema from "../database/schema";

config()

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const port = Number(process.env.PORT);
const baseURL = process.env.BETTER_AUTH_URL!;
const frontendURL = process.env.FRONTEND_URL!;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are not configured");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
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
