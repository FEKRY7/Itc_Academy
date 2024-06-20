const mongoose = require('mongoose')

const {Types} = mongoose

const lectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    video: String,
    pdf: String,
    audio: String,
    CourseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    lectureLink: String,
    labNo: String,
    hours: Number,
    objectives: [String],
  },
  { timestamps: true }
);

const LectureModel = mongoose.model("lecture", lectureSchema);

module.exports = LectureModel;
