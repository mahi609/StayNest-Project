const Joi = require('joi');
const review = require('./models/review');

module.exports.listingsschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        img: Joi.string().allow("", null)
    }).required()
});


module.exports.reviewschema = Joi.object({
    review: Joi.object({
        

        comment: Joi.string().required(),
        rating:Joi.number().min(1).required()
    }).required()
});