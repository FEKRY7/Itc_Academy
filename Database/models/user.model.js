const mongoose = require('mongoose')

const {Types} = mongoose

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minLength: 1,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "MinLength 5 Characters"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [5, "MinLength 5 Characters"],
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },

    approved: {
      type: Boolean,
      required: true,
      default: false,
    },

    teach_field: {
      type: String,
    },
    courses_taught: [
      {
        type: Types.ObjectId,
        ref: "Course",
      },
    ],
    exams: [
      {
        type: Types.ObjectId,
        ref: "Exam",
      },
    ],
    examResults: [
      {
        type: Types.ObjectId,
        ref: "ExamResult",
      },
    ],
    enrolled_courses: [
      {
        type: Types.ObjectId,
        ref: "Course",
      },
    ],
    active: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    code: Number,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports =  UserModel;
