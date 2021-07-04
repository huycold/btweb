const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/apiError');

/**
 * Validate request
 * @param {String type} schema
 * @param {Object} _object / request
 * When error just throw error with status 400,
 * or return data request.
 */
const validate = (schema) => (_object, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'cookies']);
  const object = pick(_object, Object.keys(validSchema));
  const {
    value,
    error,
  } = Joi.compile(validSchema)
    .prefs({
      errors: {
        label: 'key',
      },
    })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    if(next) {
      // for rest api
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    throw new ApiError(httpStatus.BAD_REQUEST, errorMessage)
  }
  if (next) {
    // for rest api
    const req = _object
    Object.assign(req, value);
    return next();
  }
  return value;
};

module.exports = validate;