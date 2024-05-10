import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";
import { CreateCenshareSchema } from "./censhare.schema";
import { CreateWixSchema } from "./wix.schema";

export const LoginAndInitialStepSchema = Joi.object({
  email: Joi.string().trim().regex(ValidationRegExps.email).required(),
  password: Joi.string().trim().regex(ValidationRegExps.password).required(),
});

export const FinalStepSchema = Joi.object({
  wix: CreateWixSchema,
  censhare: CreateCenshareSchema,
});

export const RefreshTokensSchema = Joi.object({
  refreshToken: Joi.string().trim().min(15).required(),
});
