import { Router } from "express";
import {
  createUserOnboardingController,
  deleteCurrentUserController,
  getCurrentUserController,
  updateCurrentUserController,
  updatePersonalProfileController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", getCurrentUserController);
userRouter.post("/me", createUserOnboardingController);
userRouter.put("/me", updateCurrentUserController);
userRouter.patch("/me", updatePersonalProfileController);
userRouter.delete("/me", deleteCurrentUserController);

export default userRouter;
