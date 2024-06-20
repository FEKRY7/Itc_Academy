const mongoose = require('mongoose')

const {Types} = mongoose

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    GroupId: {
      type: Types.ObjectId,
      ref: "Group",
      required: true,
    },
    CourseId: [
      {
        type: Types.ObjectId,
        ref: "Course",
      },
    ],
    GroupCode: {
      type: Number,
    },
    instructorId: {
      type: Types.ObjectId,
      ref: "user",
    },
    placeRating: {
      type: Number,
      min: [1, "min is 1"],
      max: [5, "max is 5"],
      required: true,
    },
    instructorRating: {
      type: Number,
      min: [1, "min is 1"],
      max: [5, "max is 5"],
      required: true,
    },
    courseMaterialRating: {
      type: Number,
      min: [1, "min is 1"],
      max: [5, "max is 5"],
      required: true,
    },
    comments: String,
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
