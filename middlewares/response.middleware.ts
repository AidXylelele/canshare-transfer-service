import { ResponseConstructor } from "../constructors/response.constructor";
import { NextFunction, Response } from "express";

export const responseMiddleware =
  (cb: any) =>
    async (req: any, res: Response, next: NextFunction): Promise<void> => {
      try {
        const data = await cb(req);

        if (data && data.refreshToken) {
          res.cookie("refreshToken", data.refreshToken);
          delete data.refreshToken;
        }

        const result = ResponseConstructor.success<any>(data);

        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    };
