import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";

export const UpdateUriSchema = Joi.object({
  upload: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).optional(),
  update: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).optional(),
  delete: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).optional(),
  logs: Joi.string().trim().min(15).pattern(ValidationRegExps.uri).optional(),
}).or("upload", "update", "delete", "logs");
