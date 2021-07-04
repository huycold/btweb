const httpStatus = require('http-status');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/apiError');

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Token>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
    const user = await userService.getUserByUsername(username);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return tokens;
};

/**
 * Verify email
 * @param {String} verifyEmailToken 
 * @returns {Promise}
 */
const verifyEmail = async verifyEmailToken => {
    try {
        const user = await tokenService.verifyToken(verifyEmailToken);
        await userService.updateUserById(user.id, {
            isEmailVerified: true,
            activeStatus: 'active'
        });
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed.')
    }
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPasswrod = async (resetPasswordToken, newPassword) => {
    try {
        const user = await tokenService.verifyToken(resetPasswordToken);
        await userService.updateUserById(user.id, {
            password: newPassword
        });
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
}

module.exports = {
    loginUserWithUsernameAndPassword,
    verifyEmail,
    resetPasswrod
}