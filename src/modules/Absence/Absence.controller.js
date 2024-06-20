const AbsenceModel = require("../../../Database/models/Absence.model.js");
const GroupModel = require("../../../Database/models/Group.model.js");
const LectureModel = require("../../../Database/models/lectuers.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const recordAbsences = async (req, res) => {
  try {
    const instructor = req.user._id;
    const { absentStudents, lectureId } = req.body;
    const { groupId } = req.params;

    const absenceCount = absentStudents.length;

    const Group = await GroupModel.findById(groupId);
    if (!Group) {
      return First(res, "Group not found", 404, http.FAIL);
    }
    const Lecture = await LectureModel.findById(lectureId);
    if (!Lecture) {
      return First(res, "Lecture not found", 404, http.FAIL);
    }
    // Create a new absence record
    const newAbsence = new AbsenceModel({
      absentStudents,
      groupId,
      instructor,
      lectureId,
      count: absenceCount,
    });

    await newAbsence.save();

    return Second(res, newAbsence, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAbsencesForLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const absences = await AbsenceModel.find({ lectureId: lectureId })
      .populate({
        path: "lectureId",
        model: "lecture",
        select: "name description",
      })
      .populate({
        path: "groupId",
        model: "Group",
        select: "code title",
      })
      .populate({
        path: "absentStudents",
        model: "user",
        select: "firstName lastName email",
      })
      .exec();

    if (absences.length === 0) {
      return First(res, "User already existed", 404, http.FAIL);
    }

    return Second(
      res,
      [`Absences report for lecture ${absences[0].lectureId.name}`, absences],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  recordAbsences,
  getAbsencesForLecture,
};
