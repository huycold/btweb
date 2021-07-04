const httpStatus = require('http-status');
const ExamScheduleModel = require('../models/exam-schedule.model');
const {
    updateUserById,
    getUserById
} = require('./user.service');
const ApiError = require('../utils/apiError');

/**
 * Create a exam schedule
 * @param {Object} examScheduleBody 
 * @returns {Promise<ExamSchedule>}
 */
const createExamSchedule = async (examScheduleBody) => {
    if (await ExamScheduleModel.isExamCodeTaken(examScheduleBody.examCode)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Exam Code already taken');
    }
    const examSchedule = await ExamScheduleModel.create(examScheduleBody);
    return examSchedule;
}

/**
 * Get examSchedule by id
 * @param {ObjectId} id
 * @returns {Promise<ExamSchedule>}
 */
const getExamScheduleById = async (id) => ExamScheduleModel.findById(id);

/**
 * Update exam schedule by id
 * @param {ObjectId} examScheduleId
 * @param {Object} updateBody
 * @returns {Promise<ExamSchedule>}
 */
const updateExamScheduleById = async (examScheduleId, updateBody) => {
    const examSchedule = await getExamScheduleById(examScheduleId);
    if (!examSchedule) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exam schedule not found');
    }
    if (updateBody.examCode && (await ExamScheduleModel.isExamCodeTaken(updateBody.examCode, examScheduleId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'ExamCode already taken');
    }
    Object.assign(examSchedule, updateBody);
    await examSchedule.save();
    return examSchedule;
};

/**
 * Delete exam schedule by id
 * @param {ObjectId} examScheduleId
 * @returns {Promise<ExamSchedule>}
 */
const deleteExamScheduleById = async (examScheduleId) => {
    const examSchedule = await getExamScheduleById(examScheduleId);
    if (!examSchedule) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exam schedule not found');
    }
    await examScheduleModel.remove();
    return examSchedule;
};

const cancelRegistExamSchedule = async (examScheduleId, userId) => {
    const user = await getUserById(userId);
    const examSchedule = await getExamScheduleById(examScheduleId);

    if (!user || !examSchedule) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Can not cancel regist exam');
    }

    const userUpdated = await updateUserById(userId, {
        examSchedule: user.examSchedule.filter(exam => exam !== examScheduleId)
    });
    await updateExamScheduleById(examScheduleId, {
        userRegistered: examSchedule.userRegistered.filter(user => user !== userId)
    })
    return userUpdated;
}

module.exports = {
    createExamSchedule,
    getExamScheduleById,
    updateExamScheduleById,
    deleteExamScheduleById,
    cancelRegistExamSchedule,
};