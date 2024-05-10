import { CustomError } from "../dto/error.dto";
import { CheckOptions } from "../types/middlewares.types";
import { NextFunction, Request, Response } from "express";

export const checkExistance =
  (options: CheckOptions) => async (req: Request, _res: Response, next: NextFunction) => {
    const { fn, isRequired } = options;
    const instance = await fn(req);

    if (isRequired && instance) return next();

    if (!isRequired && !instance) return next();

    if (isRequired && !instance) {
      const error = new CustomError("CheckExistance", "Does not exist", 404);
      return next(error);
    }

    if (!isRequired && instance) {
      const error = new CustomError("CheckExistance", "Already exists", 500);
      return next(error);
    }
  };
