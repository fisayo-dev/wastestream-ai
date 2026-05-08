import { Router } from "express";
import {
  createUserOnboardingController,
  deleteCurrentUserController,
  getCurrentUserController,
  updateCurrentUserController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", getCurrentUserController);
userRouter.post("/me", createUserOnboardingController);
userRouter.put("/me", updateCurrentUserController);
userRouter.delete("/me", deleteCurrentUserController);

export default userRouter;
