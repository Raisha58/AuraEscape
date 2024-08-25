// schema.js is being created using joi for server side validation
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0), //says that price must be a number and it cannot be negative
    image: Joi.string().allow("", null),
  }).required(),
});
