import "dotenv/config";
import cors from "cors";
import express from "express";

import healthController from "./controllers/health";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "WasteStream API is running",
  });
});

app.get("/health", healthController);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
