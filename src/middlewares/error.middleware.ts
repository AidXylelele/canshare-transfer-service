import { CustomError } from "../dto/error.dto";
import { ResponseConstructor } from "../dto/response.dto";
import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let code = 500;

  if (err instanceof CustomError) code = err.code;

  console.log(err);
  const result = ResponseConstructor.error<null>(err);
  res.status(code).json(result);
};
