import passport from "passport";
import { CustomError } from "../tools/error.tool";
import { Identification } from "../types/auth.types";
import { NextFunction, Response } from "express";
import { CheckpointService } from "../services/checkpoint.service";

const checkpointServcie = new CheckpointService();

export const authenticate =
  (isRegistered: boolean) =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      passport.authenticate(
        "jwt",
        { session: false },
        async (err: Error, data: Identification, info: any) => {
          if (err) {
            return next(err);
          }

          if (!data) {
            return next(new CustomError("Token", "Wrong token", 401));
          }

          if (info && info.name === "TokenExpiredError") {
            return next(new CustomError("Token", "Expired", 401));
          }

          const { _id, email } = data;
          req.identification = { _id, email };

          if (!isRegistered) {
            return next();
          }

          const isFinished = await checkpointServcie.getState(_id);

          if (!isFinished) {
            return next(
              new CustomError("Auth", "Complete the registration", 401)
            );
          }

          next();
        }
      )(req, res, next);
    } catch (error) {
      next(error);
    }
  };
