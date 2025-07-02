import Joi from "joi";

export const scoreSchema = Joi.object({
  wallet: Joi.string().required(),
  score: Joi.number().min(0).required(),
});
