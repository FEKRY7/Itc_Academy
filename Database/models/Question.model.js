const mongoose = require("mongoose");

const { Types } = mongoose;

const QuestionSchema = new mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },

    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
    },
    Incorrect: {
      type: Boolean,
      default: false,
    },

    CreatedBy: {
      type: Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
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

const QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;
