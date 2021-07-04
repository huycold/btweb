const httpStatus = require('http-status');
const {
    ExamScheduleService,
    UserService
} = require('../services');

async function createExamSchedule(req, res) {
    const examSchedule = await ExamScheduleService.createExamSchedule(req.body);
    res.status(httpStatus.CREATED).send({
        examSchedule
    });
}

async function registExamSchedule(req, res) {
    const { userId, ...updateBody } = req.body;
    const { examScheduleId } = req.params;
    await ExamScheduleService.updateExamScheduleById(examScheduleId, updateBody);
    await UserService.updateUserById(userId, {examSchedule: examScheduleId});
    res.status(httpStatus.NO_CONTENT).send();
}

async function cancelRegistExamSchedule(req, res) {
    await ExamScheduleService.cancelRegistExamSchedule(req.examScheduleId, req.userId);
    res.status(httpStatus.NO_CONTENT).send();
}

module.exports = {
    createExamSchedule,
    registExamSchedule,
    cancelRegistExamSchedule
}
