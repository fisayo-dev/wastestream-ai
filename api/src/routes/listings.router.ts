import { Router } from "express";
import { createListingController } from "../controllers/listing.controller";

const listingsRouter = Router();

listingsRouter.post("/", createListingController);

export default listingsRouter;
