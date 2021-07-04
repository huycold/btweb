const nodemailer = require('nodemailer');
const config = require('../config/config');
const {
    templateVerification,
    URL_FE_APP,
    templateResetPassword
} = require('../config/email');

const transport = nodemailer.createTransport({
    ...config.email.smtp,
    secure: false,
});

if (config.env !== 'test') {
    transport.verify()
        .then(() => {
            console.log({
                message: 'Connected to email server.'
            });
        }).catch(() => console.log({
            message: 'Unable to connect to email server. Make sure you have configured the SMTP options in .env file.'
        }));
}

/**
 * Send an email.
 * @param {String} to 
 * @param {String} subject 
 * @param {String} text
 * @returns {Promise} 
 */
const sendEmail = async (to, subject, text) => {
    const msg = {
        from: config.email.smtp.from,
        to,
        subject,
        text
    };
    await transport.sendMail(msg);
}


/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerifycationEmail = async (to, token) => {
    const subject = 'Email Verification';
    const verificationEmailUrl = `${URL_FE_APP}/verify-email?token=${token}`;
    const text = templateVerification(verificationEmailUrl);
    await sendEmail(to, subject, text);
}

/**
 * Send reset password email
 * @param {String} to 
 * @param {String} token 
 * @return {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
    const subject = "Reset password"
    const resetPasswordUrl = `${URL_FE_APP}/reset-password?token=${token}`;
    const text = templateResetPassword(resetPasswordUrl);
    await sendEmail(to, subject, text);
}

module.exports = {
    sendEmail,
    sendVerifycationEmail,
    sendResetPasswordEmail
}