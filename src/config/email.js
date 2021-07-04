const templateVerification = (verificationEmailUrl, userName = 'user') => `Dear ${userName},
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.
Thank you.
`

const templateResetPassword = (verificationEmailUrl, userName = 'user') => `Dear ${userName},
To reset your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.
Thank you.
`

const URL_FE_APP = 'http://localhost:3001';

module.exports = {
    URL_FE_APP,
    templateVerification,
    templateResetPassword,
}