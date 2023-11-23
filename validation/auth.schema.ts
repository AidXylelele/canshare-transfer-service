import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";

export const LoginAndInitialStepSchema = Joi.object({
  email: Joi.string().trim().regex(ValidationRegExps.email).required(),
  password: Joi.string().trim().regex(ValidationRegExps.password).required(),
});

export const FinalStepSchema = Joi.object({
  upload: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).required(),
  update: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).required(),
  delete: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).required(),
  logs: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).required(),
});
