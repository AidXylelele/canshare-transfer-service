import { CenshareValidator } from "../validation/validators/censhare.validator";
import { NextFunction, Response, Request } from "express";

const validator = new CenshareValidator();

export const checkCredentials = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = req;
    const credentials = body.censhare ? body.censhare : body;
    const { username, password } = credentials;
    await validator.checkCredentials(username, password);
    next();
  } catch (error) {
    next(error);
  }
};
