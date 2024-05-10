import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";

export const ChangePassword = Joi.object({
  oldPassword: Joi.string().trim().regex(ValidationRegExps.password).required(),
  newPassword: Joi.string().trim().regex(ValidationRegExps.password).required(),
});
