import Joi from "joi";

export const CreateCenshareSchema = Joi.object({
  username: Joi.string().trim().required().min(3),
  password: Joi.string().trim().required().min(3),
});

export const UpdateCenshareSchema = Joi.object({
  username: Joi.string().trim().min(3),
  password: Joi.string().trim().min(3),
}).or("username", "password");
