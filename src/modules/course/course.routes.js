const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");

const {
  CreateCourse,
  UpdateCourse,
  getCourses,
  getCourseById,
  deleteCourseById,
  updateCourseApprovalStatus,
  rating,
  review,
} = require("./course.controller.js");

const ExamRouter = require('../Result/Result.Router.js')

router.use("/:CourseId/exam", ExamRouter); // internal navigate

router.post(
  "/:serviceId",
  isAuthenticated,
  isAuthorized("instructor"),
  myMulter(pathName.Course).single("image"),
  HME,
  CreateCourse
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("instructor"),
  myMulter(pathName.Course).single("image"),
  HME,
  UpdateCourse
);

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("instructor"),
  deleteCourseById
);

router.put("/approvalStatus/:courseId", updateCourseApprovalStatus);
router.put(
  "/course/:CourseId/rating",
  isAuthenticated,
  isAuthorized("student"),
  rating
);
router.put(
  "/cours/:CourseId/review",
  isAuthenticated,
  isAuthorized("student"),
  review
);

module.exports = router;
