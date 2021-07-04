const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');

const ApiError = require('../utils/apiError');
const {
    tokenTypes
} = require('../config/tokens');
const config = require('../config/config');
const {
    getUserById,
    getUserByEmail
} = require('./user.service')
const {
    PRIVATE_KEY,
    PUBLIC_KEY
} = require('../config/tokens');

/**
 * Generate token
 * @param {Object} user
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (user, expires, type) => {
    const payload = {
        sub: user.id,
        tokenVersion: user.tokenVersion,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, PRIVATE_KEY, {
        algorithm: 'RS256'
    });
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toJSON(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires,
        },
    };
};

/**
 * Verify token and return user (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<User>}
 */
const verifyToken = async (token) => {
    const payload = jwt.verify(token, PUBLIC_KEY, {
        algorithms: 'RS256'
    });
    const user = await getUserById(payload.sub);
    if (!user) {
        throw new Error('User not found')
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
    }

    return user;
};

/**
 * Generate verify email token;
 * @param {Object<User_id, Token_version>} user
 * @returns {Promise<String>}
 */
const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
}

/**
 * Generate reset password token;
 * @param {String} email 
 * @returns {Promise<String>}
 */
const generateResetPasswordToken = async (email) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    return generateToken(user, expires, tokenTypes.RESET_PASSWORD);
}

module.exports = {
    generateAuthTokens,
    verifyToken,
    generateVerifyEmailToken,
    generateResetPasswordToken
}