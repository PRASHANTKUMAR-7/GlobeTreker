//schema validation on server side using JOI 
const Joi = require('joi');
const Reviews = require('./models/review');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),

    image: Joi.object({
      url: Joi.string().uri().allow("", null),   // allow empty or missing
      filename: Joi.string().allow("", null)
    }).optional()
  }).required()
});


//Schema for validation of review for server side using joi 
module.exports.reviewSchema=Joi.object({
  reviews:Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required(),
  }).required()
})