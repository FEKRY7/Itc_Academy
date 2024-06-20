const mongoose = require('mongoose');

const { Types } = mongoose;

// Define the schema for the Course model
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course_imageId: {
    type: String,
  },
  course_imageUrl: String,
  description: {
    type: String,
    required: true,
  },
  lectureIds: [
    {
      type: Types.ObjectId,
      ref: "Lecture", // Fixed reference to match the model name
    },
  ],
  serviceId: {
    type: Types.ObjectId,
    ref: "Service", // Fixed reference to match the model name
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  total_duration: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  students_enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  enrollment_count: {
    type: Number,
    default: 0, // Default value is set to 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0, // Minimum allowed value
    max: 5, // Maximum allowed value
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      text: String,
    },
  ],
});

courseSchema.pre("remove", async function (next) {
  try {
    await this.model("Lecture").deleteMany({ _id: { $in: this.lectureIds } });
    next();
  } catch (error) {
    next(error);
  }
});

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
