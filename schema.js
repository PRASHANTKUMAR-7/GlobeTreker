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
      url: Joi.string().uri().required(),
      filename: Joi.string().optional()
    }).required()
  }).required()
});


//Schema for validation of review for server side using joi 
module.exports.reviewSchema=Joi.object({
  Reviews:Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required()
})