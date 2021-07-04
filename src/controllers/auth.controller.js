const httpStatus = require('http-status');
const {
    AuthService,
    TokenService,
    EmailService,
    UserService
} = require('../services');

/**
 * Send refresh token like cookie.
 * @param {Response} res 
 * @param {Object token} refresh 
 * @returns No return or return null
 */
const sendRefreshToken = (res, refresh) => {
    if (refresh && Object.keys(refresh).length > 0) {
        res.cookie('jid', refresh.token, {
            maxAge: refresh.expires,
            httpOnly: true,
            path: '/graphql',
            sameSite: 'Lax',
        })
        return null;
    }
    res.cookie('jid', "")
    return null;
}

async function register(req, res) {
    const user = await UserService.createUser(req.body);
    const tokens = await TokenService.generateAuthTokens(user);
    sendRefreshToken(res, tokens.refresh);
    res.status(httpStatus.CREATED).send({
        user,
        access: tokens.access
    });
}

async function login(req, res) {
    const {
        username,
        password
    } = req.body;
    const tokens = await AuthService.loginUserWithUsernameAndPassword(username, password)
    sendRefreshToken(res, tokens.refresh);
    res.json({
        access: tokens.access
    });
    return null;
}

async function logout(req, res) {
    const user = await TokenService.verifyToken(req.query.token);
    await UserService.updateUserById(user.id, {
        tokenVersion: user.tokenVersion + 1
    })
    sendRefreshToken(res, {});
    res.json({
        logout: true,
        message: 'bye'
    });
    return null;
}

async function sendVerificationEmail(req, res) {
    const verifyEmailToken = await TokenService.generateVerifyEmailToken(req.user);
    await EmailService.sendVerifycationEmail(req.user.email, verifyEmailToken)
    res.status(httpStatus.NO_CONTENT).send();
    return null;
}

async function verifyEmail(req, res) {
    await AuthService.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
    return null
}

async function forgotPassword(req, res) {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(req.body.email);
    await EmailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
}

async function resetPassword(req, res) {
    await AuthService.resetPasswrod(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
}

module.exports = {
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
    forgotPassword,
    resetPassword,
    register
}