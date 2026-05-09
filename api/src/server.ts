import { config } from "dotenv";
import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import healthController from "./controllers/health.controller";
import { ensureAuthSchema } from "./database/ensure-auth-schema";
import { authBasePath, frontendURL, port } from "./constants/general";
import { auth } from "./lib/auth";
import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import listingsRouter from "./routes/listings.router";

config();

const app = express();
app.set("trust proxy", 1);

// cors
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
  }),
);

app.all(`${authBasePath}/*splat`, toNodeHandler(auth));
app.use(express.json());

// Base route
app.get("/v1", (_req, res) => {
  res.json({
    message: "WasteStream API is running",
  });
});

// Health
app.head("/v1/health", healthController);
app.get("/v1/health", healthController);

// Auth
app.use("/v1/auth", authRouter);

// User
app.use("/v1/user", userRouter);

// Listings
app.use("/v1/listings", listingsRouter);

// Start server
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
