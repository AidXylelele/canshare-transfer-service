import { CustomError } from "../tools/error.tool";
import { CheckOptions } from "../types/middlewares.types";
import { NextFunction, Response } from "express";

export const checkExistance =
  (options: CheckOptions) =>
  async (req: any, _res: Response, next: NextFunction) => {
    const { fn, isRequired } = options;
    const instance = await fn(req);

    if (isRequired && instance) return next();

    if (!isRequired && !instance) return next();

    if (isRequired && !instance) {
      const error = new CustomError("CheckExistance", "Does not exist", 404);
      return next(error);
    }

    if (!isRequired && instance) {
      const error = new CustomError("CheckExistance", "Already exists", 404);
      return next(error);
    }
  };
