const Joi = require('joi');
const password = require('./customs/passwrod');

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const verifyEmail = {
    query: {
        token: Joi.string().required(),
    }
}

const forgotPassword = {
    body: {
        email: Joi.string().email().required(),
    }
}

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: {
        password: Joi.string().required().custom(password),
    }
}

const logout = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    })
}

const register = {
    body: Joi.object().keys({
        fullName: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required().custom(password),
        gender: Joi.string(),
        highSchool: Joi.string(),
        role: Joi.string(),
    })
}

module.exports = {
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    register
}