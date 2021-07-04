const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const catchAsync = require('../../utils/catchAsync');
const {
    createExamSchedule,
    registExamSchedule,
    cancelRegistExamSchedule
} = require('../../controllers/exam-schedule.controller');
const {
    examScheduleValidation
} = require('../../validations');

const router = express.Router();

router.post('/create', validate(examScheduleValidation.create), catchAsync(createExamSchedule));

router.patch('/regist', validate(examScheduleValidation.register), catchAsync(registExamSchedule));
router.patch('/cancel-regist', validate(examScheduleValidation.cancelRegist), catchAsync(cancelRegistExamSchedule));