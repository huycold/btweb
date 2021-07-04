const mongoose = require('mongoose');

const examScheduleSchema = mongoose.Schema({
    examCode: {
        type: String,
        trim: true,
        require: true,
    },
    displayName: {
        type: String,
        trim: true,
        require: true,
    },
    startedAt: {
        type: String,
        require: true,
    },
    endedAt: {
        type: String,
        require: true,
    },
    examTime: {
        type: String,
        require: true,
    },
    status: {
        type: Number,
        default: 1
    },
    userRegistered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

/**
 * Check if examCode is taken
 * @param {string} examCode - The exam's examCode
 * @param {ObjectId} [excludeExamCodeId] - The id of the exam to be excluded
 * @returns {Promise<boolean>}
 */
 examScheduleSchema.statics.isExamCodeTaken = async function (examCode, excludeExamCodeId) {
    const examSchedule = await this.findOne({
        examCode,
        _id: {
            $ne: excludeExamCodeId,
        },
    });
    return !!examSchedule;
};

/**
 * @typedef ExamSchedule
 */
 const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);

 module.exports = ExamSchedule;
