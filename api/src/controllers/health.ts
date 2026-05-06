import type { Request, Response } from "express";

import { checkDatabaseConnection } from "../database/index.js";

const healthController = async (_req: Request, res: Response) => {
  try {
    const database = await checkDatabaseConnection();

    res.json({
      status: "ok",
      database,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    res.status(500).json({
      status: "error",
      message,
    });
  }
};

export default healthController;
