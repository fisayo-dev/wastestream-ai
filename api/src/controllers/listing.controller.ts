import type { Request, Response } from "express";

import { db } from "../database";
import * as schema from "../database/schema";
import { requireSession } from "../lib/request-auth";

export async function createListingController(req: Request, res: Response) {
  const session = await requireSession(req, res);

  if (!session) {
    return;
  }

  const {
    title,
    description,
    wasteTypeId,
    quantity,
    quantityUnit,
    condition,
    country,
    state,
    city,
  } = req.body ?? {};

  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Missing required field: title" });
    return;
  }

  try {
    const now = new Date();

    const result = await db
      .insert(schema.listing)
      .values({
        title: title.trim(),
        description: description ?? null,
        userId: session.user.id,
        wasteTypeId: typeof wasteTypeId === "number" ? wasteTypeId : null,
        quantity: quantity ?? null,
        quantityUnit: quantityUnit ?? null,
        condition: condition ?? null,
        country: country ?? null,
        state: state ?? null,
        city: city ?? null,
        status: "active",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    res.status(201).json({ listing: result[0] });
  } catch (error) {
    console.error("Failed to create listing", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
}

export default createListingController;
