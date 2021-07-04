const Joi = require('joi');

const create = {
    body: Joi.object().keys({
        examCode: Joi.string().required(),
        displayName: Joi.string().email().required(),
        startedAt: Joi.string().required(),
        endedAt: Joi.string().required(),
        examTime: Joi.string().required(),
        status: Joi.number(),
    })
}

const cancelRegist = {
    body: Joi.object().keys({
        examScheduleId: Joi.string().required(),
        userId: Joi.string().required(),
    })
}

const register = {
    params: Joi.object().keys({
        examScheduleId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        userRegistered: Joi.array().items(Joi.string()).required(),
        userId: Joi.string().required(),
    })
}

module.exports = {
    create,
    register,
    cancelRegist
}