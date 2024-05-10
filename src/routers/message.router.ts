import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";
import { MessageController } from "../controllers/message.controller";
import { responseMiddleware } from "../middlewares/response.middleware";
import { NotificationSchema } from "../validation/message.schema";

export const messageRouter = Router();

const сontroller = new MessageController();

messageRouter.post(
  "/notify",
  validate(NotificationSchema),
  authenticate(true),
  responseMiddleware(сontroller.processChangesNotification),
  errorMiddleware,
);

messageRouter.post(
  "/synchronize",
  authenticate(true),
  responseMiddleware(сontroller.synchronize),
  errorMiddleware,
);
