const mongoose = require("mongoose");

const { Types } = mongoose;

const AbsenceSchema = new mongoose.Schema(
  {
    absentStudents: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    lectureId: { type: Types.ObjectId, ref: "lecture", required: true },
    groupId: { type: Types.ObjectId, ref: "Group", required: true },
    instructor: { type: Types.ObjectId, ref: "Instructor", required: true },
    count: { type: Number, default: 0 },
  },
  {
    timeseries: true,
  }
);

const AbsenceModel = mongoose.model("Absence", AbsenceSchema);
module.exports = AbsenceModel;
