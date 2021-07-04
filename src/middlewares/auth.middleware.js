const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');

function verifyCallback(req, resolve, reject, requiredRights) {
    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;
        resolve();
    }
}

const auth = (...requiredRights) => async (req, res, next) => new Promise((resolve, reject) => {
        passport.authenticate('jwt', {
            session: false
        }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
    .then(() => next())
    .catch(err => next(err));

module.exports = auth;