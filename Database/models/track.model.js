const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

// Define the schema for Course
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lectures: [
    {
      type: Types.ObjectId,
      ref: "Lecture",
    },
  ],
});

// Define the schema for Review
const reviewSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "Student",
  },
  text: String,
});

// Define the schema for the Track model
const trackSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  track_image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  serviceId: {
    type: Types.ObjectId,
    ref: "Service",
    required: true,
  },
  content: [courseSchema],
  categoryId: [
    {
      type: Types.ObjectId,
      ref: "Category",
    },
  ],
  total_duration: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  students_enrolled: [
    {
      type: Types.ObjectId,
      ref: "Student",
    },
  ],
  enrollment_count: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [reviewSchema],
});

const TrackModel = mongoose.model("Track", trackSchema);
module.exports = TrackModel;
