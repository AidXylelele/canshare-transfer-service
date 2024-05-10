import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";
import { checkCredentials } from "../middlewares/checkCredentials";
import { responseMiddleware } from "../middlewares/response.middleware";
import { CenshareController } from "../controllers/censhare.controller";
import { UpdateCenshareSchema } from "../validation/censhare.schema";

export const censhareRouter = Router();

const сontroller = new CenshareController();

censhareRouter.get(
  "/",
  authenticate(true),
  responseMiddleware(сontroller.getByUserId),
  errorMiddleware
);

censhareRouter.post(
  "/update",
  validate(UpdateCenshareSchema),
  checkCredentials,
  authenticate(true),
  responseMiddleware(сontroller.update),
  errorMiddleware
);
