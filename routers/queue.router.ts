import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
// import { validate } from "../middlewares/validate.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { QueueController } from "../controllers/queue.controller";

export const queueRouter = Router();

const queueController = new QueueController();

queueRouter.post(
  "/upload",
  //   validate(LoginAndInitialStepSchema),
  authenticate(true),
  responseMiddleware(queueController.upload.bind(queueController)),
  errorMiddleware
);

queueRouter.post(
  "/update",
  //   validate(LoginAndInitialStepSchema),
  authenticate(true),
  responseMiddleware(queueController.update.bind(queueController)),
  errorMiddleware
);

queueRouter.post(
  "/delete",
  //   validate(LoginAndInitialStepSchema),
  authenticate(true),
  responseMiddleware(queueController.delete.bind(queueController)),
  errorMiddleware
);
