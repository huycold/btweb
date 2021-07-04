const dotevn = require('dotenv');
const path = require('path');
const joi = require('joi');

dotevn.config({
    path: path.join(__dirname, '../../.env')
});

const envVarsSchema = joi.object()
    .keys({
        NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
        PORT: joi.number().default(3001),
        MONGODB_URL: joi.string().required().description('Mongo DB Url'),
        // jwt
        JWT_ACCESS_EXPIRATION_MINUTES: joi.number().default(30).description('Minutes after withc access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: joi.number().default(30).description('Days after which refresh tokens expire'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number().default(10).description('Minutes after which verify email token expires'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number().default(10).description('Minutes after which reset password token expires'),
        // mail service
        SMTP_HOST: joi.string().description('Server that will send the emails'),
        SMTP_PORT: joi.number().description('Port to connect to the email server'),
        STMP_USERNAME: joi.string().description('Username for email server'),
        SMTP_PASSWORD: joi.string().description('Password for email server'),
        EMAIL_FROM: joi.string().description('The from field in the emails sent by the app'),
    }).unknown();

const {
    value: envVars,
    error
} = envVarsSchema.prefs({
    errors: {
        label: 'key'
    }
}).validate(process.env);

if (error) {
    throw new Error(`Config validataion error: ${error.message}`)
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
      url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    jwt: {
      accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
      secret: 'abcasdasd',
      verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
      resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    },
    email: {
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        from: envVars.EMAIL_FROM,
        auth: {
          user: envVars.STMP_USERNAME,
          pass: envVars.SMTP_PASSWORD,
        },
      }
    }
  }
