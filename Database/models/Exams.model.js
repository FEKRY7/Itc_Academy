const mongoose = require('mongoose')

const {Types} = mongoose

const QuestionModel = require('./Question.model.js')

const ExamSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    description: {
        type: String,
    },
    duration: {
        type: String,
        required: [true, 'duration is required'],
        default: "50 minutes"
    },

    examType: {
        type: String,
        required: [true, 'examType is required'],
        default: "Quiz"
    },


    examStatus: {
        type: String,
        default: "pending",
        enum: ["pending","live"]
    },

    Questions: [{
        type: Types.ObjectId,
        ref: "Question",
        required: true
    }],
    
    Createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    totalMark: {
        type: Number,
        required: true,
        default: 100
    },
    passMark: {
        type: Number,
        required: true,
        default: 50
    },
    CourseId: {
        type: Types.ObjectId,
        ref: 'Course',
        required:true,
    },
   
}, {
    timestamps: true
})



ExamSchema.pre('findOneAndDelete', async function (next) {
    const exam = this; 

    try {
        const deletedExam = await exam.model.findOne(exam.getFilter());
        if (deletedExam) {
            // If the exam is found and about to be deleted, delete related questions
            await QuestionModel.deleteMany({ _id: { $in: deletedExam.Questions } });
        }
        next(); // Continue with the deletion process
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
});

const ExamModel = mongoose.model('Exam', ExamSchema)
module.exports = ExamModel