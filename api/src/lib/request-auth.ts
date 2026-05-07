import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "./auth";

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getSessionFromRequest(req: Request) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}

export async function requireSession(req: Request, res: Response) {
  const session = await getSessionFromRequest(req);

  if (!session) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return null;
  }

  return session;
}
