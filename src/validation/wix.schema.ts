import Joi from "joi";

export const CreateWixSchema = Joi.object({
  apiKey: Joi.string().required(),
  siteId: Joi.string().required(),
});

export const UpdateWixSchema = Joi.object({
  apiKey: Joi.string().optional(),
  siteId: Joi.string().optional(),
}).or("apiKey", "siteId");
