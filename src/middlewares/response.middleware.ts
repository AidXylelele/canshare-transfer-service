import { ResponseConstructor } from "../dto/response.dto";
import { Request, NextFunction, Response } from "express";

export const responseMiddleware =
  <T extends Function, R extends Request>(cb: T) =>
  async (req: R, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cb(req);
      const responseBody = data ?? null;
      const result = ResponseConstructor.success(responseBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
