import "dotenv/config";
import cors from "cors";
import express from "express";

import { checkDatabaseConnection } from "./database";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "WasteStream API is running",
  });
});

app.get("/health", async (_req, res) => {
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
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
