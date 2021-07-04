const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth');
const examScheduleRoute = require('./exam-schedule.route');

const router = express.Router();
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/exam-schedule',
        route: examScheduleRoute
    },
]

defaultRoutes.forEach(route => {
    router.use(route.path, route.route)
})

module.exports = router;
