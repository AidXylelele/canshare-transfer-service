import { Router } from "express";
import {
  FinalStepSchema,
  LoginAndInitialStepSchema,
} from "../validation/auth.schema";
import { UserController } from "../controllers/user.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { validate } from "../middlewares/validate.middleware";
import { checkExistance } from "../middlewares/existance.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { ping } from "../middlewares/ping.middleware";

export const userRouter = Router();

const userController = new UserController();

userRouter.post(
  "/registration/step-one",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: false,
    fn: userController.getByEmail.bind(userController),
  }),
  responseMiddleware(userController.initRegistration.bind(userController)),
  errorMiddleware
);

userRouter.post(
  "/registration/step-two",
  validate(FinalStepSchema),
  ping,
  authenticate(false),
  checkExistance({
    isRequired: true,
    fn: userController.getById.bind(userController),
  }),
  responseMiddleware(userController.finishRegistration.bind(userController)),
  errorMiddleware
);

userRouter.post(
  "/login",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: true,
    fn: userController.getByEmail.bind(userController),
  }),
  responseMiddleware(userController.login.bind(userController)),
  errorMiddleware
);

userRouter.get(
  "/refresh",
  responseMiddleware(userController.refresh.bind(userController)),
  errorMiddleware
);
