import type { Request, Response } from "express";

import { requireSession } from "../lib/request-auth";
import {
  buildAuthProfile,
  buildFallbackAuthProfile,
  createOnboardingProfile,
  deleteOnboardingProfile,
  updateOnboardingProfile,
  validateOnboardingInput,
} from "../lib/user-profile";

export async function getCurrentUserController(req: Request, res: Response) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  try {
    res.json(await buildAuthProfile(session));
  } catch (error) {
    console.error("Failed to build current user profile", error);
    res.json(buildFallbackAuthProfile(session));
  }
}

export async function createUserOnboardingController(
  req: Request,
  res: Response,
) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  const validation = validateOnboardingInput(req.body);

  if (!validation.data) {
    res.status(400).json({
      message: "Invalid onboarding payload.",
      errors: validation.errors,
    });
    return;
  }

  const result = await createOnboardingProfile(session, validation.data);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.message,
    });
    return;
  }

  res.status(201).json(result.data);
}

export async function updateCurrentUserController(req: Request, res: Response) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  const validation = validateOnboardingInput(req.body);

  if (!validation.data) {
    res.status(400).json({
      message: "Invalid onboarding payload.",
      errors: validation.errors,
    });
    return;
  }

  const result = await updateOnboardingProfile(session, validation.data);

  res.status(result.status).json(result.data);
}

export async function deleteCurrentUserController(req: Request, res: Response) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  await deleteOnboardingProfile(session.user.id);

  res.status(204).send();
}
