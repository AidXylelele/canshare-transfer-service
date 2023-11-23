import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import { validate } from "../middlewares/validate.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { UriController } from "../controllers/uri.controller";
import { UpdateUriSchema } from "../validation/uri.schema";
import { ping } from "../middlewares/ping.middleware";

export const uriRouter = Router();

const uriController = new UriController();

uriRouter.get(
  "/",
  authenticate(true),
  responseMiddleware(uriController.getByUserId.bind(uriController)),
  errorMiddleware
);

uriRouter.post(
  "/update",
  validate(UpdateUriSchema),
  ping,
  authenticate(true),
  responseMiddleware(uriController.update.bind(uriController)),
  errorMiddleware
);
