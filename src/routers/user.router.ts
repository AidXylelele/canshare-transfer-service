import { Router } from "express";
import {
  FinalStepSchema,
  RefreshTokensSchema,
  LoginAndInitialStepSchema,
} from "../validation/auth.schema";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { checkExistance } from "../middlewares/existance.middleware";
import { ChangePassword } from "../validation/user.schema";
import { UserController } from "../controllers/user.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { checkCredentials } from "../middlewares/checkCredentials";
import { responseMiddleware } from "../middlewares/response.middleware";

export const userRouter = Router();

const controller = new UserController();

userRouter.post(
  "/registration/step-one",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: false,
    fn: controller.getByEmail,
  }),
  responseMiddleware(controller.initRegistration),
  errorMiddleware,
);

userRouter.post(
  "/registration/step-two",
  validate(FinalStepSchema),
  checkCredentials,
  authenticate(false),
  checkExistance({
    isRequired: true,
    fn: controller.getById,
  }),
  responseMiddleware(controller.finishRegistration),
  errorMiddleware,
);

userRouter.post(
  "/login",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: true,
    fn: controller.getByEmail,
  }),
  responseMiddleware(controller.login),
  errorMiddleware,
);

userRouter.post(
  "/refresh",
  validate(RefreshTokensSchema),
  responseMiddleware(controller.refresh),
  errorMiddleware,
);

userRouter.put(
  "/password/change",
  validate(ChangePassword),
  authenticate(true),
  responseMiddleware(controller.changePassword),
  errorMiddleware,
);

userRouter.delete(
  "/delete",
  authenticate(true),
  responseMiddleware(controller.delete),
  errorMiddleware,
);
