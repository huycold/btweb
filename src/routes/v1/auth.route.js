const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const {
    authValidation
} = require('../../validations');
const authMiddleware = require('../../middlewares/auth.middleware');
const catchAsync = require('../../utils/catchAsync');
const {
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
    forgotPassword,
    resetPassword,
    register
} = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/login', validate(authValidation.login), catchAsync(login));
router.post('/logout', validate(authValidation.logout), catchAsync(logout));

router.post('/send-verification-email', authMiddleware(), catchAsync(sendVerificationEmail));
router.post('/verify-email', validate(authValidation.verifyEmail), catchAsync(verifyEmail));

router.post('/forgot-password', validate(authValidation.forgotPassword), catchAsync(forgotPassword));
router.post('/reset-password', validate(authValidation.resetPassword), catchAsync(resetPassword));
router.post('/register', validate(authValidation.register), catchAsync(register))

module.exports = router;