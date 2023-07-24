const Joi = require('joi');

const joiSchemaBooksValidator = Joi.object({
    title: Joi.string()
        .trim()
        .required(),

    author: Joi.string()
    .trim()
    .required(),

    genre: Joi.string()
    .trim()
    .required(),

    price: [
        Joi.number()
        .min(0)
    ],

    stock: Joi.number()
    .min(0),

})

const joiSchemaUserValidator = Joi.object({
    userName: Joi.string()
    .email()
    .trim()
    .required(),

    password: Joi.string()
    .trim()
    .required(),

    roleName: Joi.string()
    .trim()
    .required(),

    tokens: [{
        token: Joi.string()
        .trim()
        .required(),
    }]
})


module.exports = {joiSchemaBooksValidator, joiSchemaUserValidator};