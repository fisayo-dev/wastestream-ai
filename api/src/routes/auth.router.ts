import { fromNodeHeaders } from "better-auth/node";
import { Router } from "express";
import { auth, frontendURL } from "../lib/auth";
import { authBasePath, port } from "../constants/general";
import { applyHeadersToResponse } from "../lib/http";

const authRouter = Router();

authRouter.get("/google", (req, res) => {
  const callbackURL =
    typeof req.query.callbackURL === "string" &&
    req.query.callbackURL.length > 0
      ? req.query.callbackURL
      : `${frontendURL}/dashboard`;

  const signInURL = new URL(
    `${authBasePath}/sign-in/social`,
    `http://localhost:${port}`,
  );
  signInURL.searchParams.set("provider", "google");
  signInURL.searchParams.set("callbackURL", callbackURL);

  res.redirect(signInURL.pathname + signInURL.search);
});

authRouter.get("/session", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  res.json(session ?? null);
});

authRouter.post("/logout", async (req, res) => {
  const result = await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
  });

  applyHeadersToResponse(res, result.headers);
  res.status(200).json({ success: true });
});

export default authRouter;
