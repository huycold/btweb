require('dotenv');
const express = require('express');
const httpStatus = require('http-status');
const passport = require('passport');

const config = require('./config/config');
const {
    jwtStrategy
} = require('./config/passport');
const ApiError = require('./utils/apiError');
const routes = require('./routes/v1');
const { jwtStrategy } = require('./config/passport');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({
    extended: true
}));

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
