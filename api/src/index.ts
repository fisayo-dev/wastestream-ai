import "dotenv/config";
import cors from "cors";
import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

import { auth, frontendURL } from "./auth.js";
import healthController from "./controllers/health.js";
import { ensureAuthSchema } from "./database/ensure-auth-schema.js";
import { applyHeadersToResponse } from "./lib/http.js";

const app = express();
const port = Number(process.env.PORT ?? 2300);
const authBasePath = "/api/auth";

app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  }),
);

app.all(`${authBasePath}/*splat`, toNodeHandler(auth));
app.use(express.json());


app.get("/v1", (_req, res) => {
  res.json({
    message: "WasteStream API is running",
  });
});

app.get("/v1/health", healthController);

app.get("/v1/auth/google", (req, res) => {
  const callbackURL =
    typeof req.query.callbackURL === "string" && req.query.callbackURL.length > 0
      ? req.query.callbackURL
      : `${frontendURL}/dashboard`;

  const signInURL = new URL(`${authBasePath}/sign-in/social`, `http://localhost:${port}`);
  signInURL.searchParams.set("provider", "google");
  signInURL.searchParams.set("callbackURL", callbackURL);

  res.redirect(signInURL.pathname + signInURL.search);
});

app.get("/v1/auth/session", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  res.json(session ?? null);
});

app.post("/v1/auth/logout", async (req, res) => {
  const result = await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
  });

  applyHeadersToResponse(res, result.headers);
  res.status(200).json({ success: true });
});

async function bootstrap() {
  await ensureAuthSchema();

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
