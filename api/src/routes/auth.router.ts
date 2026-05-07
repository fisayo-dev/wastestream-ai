import { Router } from "express";
import { frontendURL } from "../lib/auth";
import { authBasePath, port } from "../constants/general";
import {
  getAuthProfileController,
  getSessionController,
  logoutController,
} from "../controllers/auth.controller";

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

authRouter.get("/session", getSessionController);
authRouter.get("/profile", getAuthProfileController);
authRouter.post("/logout", logoutController);

export default authRouter;
