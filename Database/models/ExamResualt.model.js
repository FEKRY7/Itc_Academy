const mongoose = require('mongoose')

const {Types} = mongoose

const ExamResultSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["failed", "passed"],
      default: "failed",
    },
    remark: {
      type: String,
      required: true,
      enum: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'],
      default: "poor",
    },

    score: {
      type: Number,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    IsPublished: {
      type: Boolean,
      default: false,
    },

    studentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    answerQesutions: [
      {
        type: Object,
      },
    ],
    ExamId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExamResultModel = mongoose.model("ExamResult", ExamResultSchema);
module.exports = ExamResultModel;
