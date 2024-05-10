import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import { validate } from "../middlewares/validate.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { WixController } from "../controllers/wix.controller";
import { UpdateWixSchema } from "../validation/wix.schema";

export const wixRouter = Router();

const сontroller = new WixController();

wixRouter.get(
  "/",
  authenticate(true),
  responseMiddleware(сontroller.getByUserId),
  errorMiddleware
);

wixRouter.post(
  "/update",
  validate(UpdateWixSchema),
  authenticate(true),
  responseMiddleware(сontroller.update),
  errorMiddleware
);
