const mongoose = require("mongoose");

const { Types } = mongoose;

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    studentId: [
      { 
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    materials: [
      {
        type: Types.ObjectId,
        ref: "Course",
      },
    ],

    Sessions: [
      {
        type: Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  { timestamps: true }
);

const GroupModel = mongoose.model("Group", groupSchema);

module.exports = GroupModel;
