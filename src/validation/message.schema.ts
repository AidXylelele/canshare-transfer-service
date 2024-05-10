import Joi from "joi";

export const NotificationSchema = Joi.object({
  ids: Joi.array().items(Joi.number()).required(),
  subscription: Joi.object({
    filter: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
    key: Joi.string().required(),
  }).required(),
});
