import { CustomError } from "../tools/error.tool";
import { ResponseConstructor } from "../constructors/response.constructor";
import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const result = ResponseConstructor.error<null>(err);
  res.status(500).json(result);
};
