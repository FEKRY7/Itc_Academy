const LectureModel = require("../../../Database/models/lectuers.model.js");
const CourseModel = require("../../../Database/models/course.model.js");
const fs = require("fs");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// endpoint to createLectureWithFiles ..........

const createLectureWithFiles = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }

    const video = req.files["video"] ? req.files["video"][0].path : null;
    const audio = req.files["audio"] ? req.files["audio"][0].path : null;
    const pdf = req.files["pdf"] ? req.files["pdf"][0].path : null;

    const lectureData = {
      ...req.body,
      video,
      audio,
      pdf,
    };

    const newLecture = new LectureModel({
      ...lectureData,
      CourseId: courseId,
      CreatedBy: req.user._id,
    });

    const createdLecture = await newLecture.save();

    course.lectureIds.push(createdLecture._id);
    await course.save();

    return Second(
      res,
      ["Lecture created successfully", { data: createdLecture }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// endpoint to getAllLecturers ..........

const getAllLecturers = async (req, res) => {
  try {
    const lectures = await LectureModel.find({});

    return Second(
      res,
      ["This is All Lecturers", { data: lectures }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// endpoint to getSpecificLecturer ..........

const getSpecificLecturer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lecturer = await LectureModel.findById(id);
    if (!lecturer) {
      return First(res, "Lecturer Not Found", 404, http.FAIL);
    }

    return Second(res, ["Success", { data: lecturer }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// endpoint to deleteOldFile ..........

const deleteOldFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.promises.unlink(filePath);
      console.log("Old file deleted successfully");
    } else {
      console.log("Old file not found");
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Error deleting old file", 500, http.ERROR);
  }
};

// endpoint to updateLecture ..........

const updateLecture = async (req, res, next) => {
  const { lectureId } = req.params;
  try {
    let lecture = await LectureModel.findById(lectureId);
    if (!lecture) {
      return First(res, "Lecture not found", 404, http.FAIL);
    }
    if (req.files) {
      const video = req.files["video"] ? req.files["video"][0] : null;
      const audio = req.files["audio"] ? req.files["audio"][0] : null;
      const pdf = req.files["pdf"] ? req.files["pdf"][0] : null;

      if (video) {
        // Delete old video file if it exists
        deleteOldFile(lecture.video);
        lecture.video = video.path;
      }

      if (audio) {
        // Delete old audio file if it exists
        deleteOldFile(lecture.audio);
        lecture.audio = audio.path;
      }

      if (pdf) {
        // Delete old pdf file if it exists
        deleteOldFile(lecture.pdf);
        lecture.pdf = pdf.path;
      }
    }

    Object.assign(lecture, req.body);

    const updatedLecture = await lecture.save();

    return Second(
      res,
      ["Lecture updated successfully", { data: updatedLecture }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// endpoint to deleteLecture ..........

const deleteLecture = async (req, res, next) => {
  const { lectureId } = req.params;
  try {
    // Check if the lecture exists
    const lecture = await LectureModel.findById(lectureId);
    if (!lecture) {
      return First(res, "Lecture Not Found", 404, http.FAIL);
    }

    // Find the course to which the lecture belongs
    const course = await CourseModel.findOne({ lectureIds: lectureId });

    // Delete lecture files if they exist
    if (lecture.video) {
      deleteOldFile(lecture.video);
    }
    if (lecture.audio) {
      deleteOldFile(lecture.audio);
    }
    if (lecture.pdf) {
      deleteOldFile(lecture.pdf);
    }

    // Delete the lecture document from the database
    await LectureModel.findByIdAndDelete(lectureId);

    // If course is found, remove the lecture's ID from course lectureIds array
    if (course) {
      course.lectureIds.pull(lectureId);
      await course.save();
    }

    return Second(res, "Lecture deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createLectureWithFiles,
  getAllLecturers,
  getSpecificLecturer,
  deleteOldFile,
  updateLecture,
  deleteLecture,
};
