const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");

const {
  createLectureWithFiles,
  getAllLecturers,
  getSpecificLecturer,
  updateLecture,
  deleteLecture,
} = require("./lectuers.controller.js");

// POST /create - Create a new lecture
router.post(
  "/create/:courseId",
  isAuthenticated,
  isAuthorized("instructor"),
  myMulter(pathName.lectureFiles).fields([
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  HME,
  createLectureWithFiles
);

// GET / - Get all lectures
router.get("/", getAllLecturers);

// // GET /:id - Get a specific lecture
router.get("/:id", getSpecificLecturer);

// PUT /:id - Update a lecture
router.put(
  "/:lectureId",
  myMulter(pathName.lectureFiles).fields([
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  HME,
  updateLecture
);

// DELETE /:id - Delete a lecture
router.delete(
  "/:lectureId",
  isAuthenticated,
  isAuthorized("instructor"),
  deleteLecture
);

module.exports = router;
