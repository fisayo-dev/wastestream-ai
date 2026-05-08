import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth";
import { applyHeadersToResponse } from "../lib/http";
import { buildAuthProfile, buildFallbackAuthProfile } from "../lib/user-profile";
import { requireSession } from "../lib/request-auth";

export async function getSessionController(req: Request, res: Response) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  res.json(session ?? null);
}

export async function getAuthProfileController(req: Request, res: Response) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  try {
    res.json(await buildAuthProfile(session));
  } catch (error) {
    console.error("Failed to build auth profile", error);
    res.json(buildFallbackAuthProfile(session));
  }
}

export async function logoutController(req: Request, res: Response) {
  const result = await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
  });

  applyHeadersToResponse(res, result.headers);
  res.status(200).json({ success: true });
}
