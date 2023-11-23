import {
  Strategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { CustomError } from "../tools/error.tool";
import { Identification } from "../types/auth.types";
import { PassportStatic } from "passport";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET,
};

export const applyPassportStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      options,
      async (data: Identification, done: VerifiedCallback) => {
        try {
          if (data._id) {
            return done(null, data);
          }
          return done(null, false);
        } catch (e) {
          throw new CustomError("Token", "Invalid token", 501);
        }
      }
    )
  );
};
