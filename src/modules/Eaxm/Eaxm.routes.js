const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const { CreateExam, GetExamById, writeExam } = require("./Eaxm.valid.js");

const {
  CreatExam,
  GetExams,
  GetExamByid,
  UpdateExam,
  TakeExam,
  DeleteExam,
  updateExamStatus,
} = require("./Eaxm.controller.js");

//Exam routers
router.post(
  "/:CourseId",
  validation(CreateExam),
  isAuthenticated,
  isAuthorized("instructor"),
  CreatExam
);

// fetched Exams
router.get("/:CourseId", isAuthenticated, isAuthorized("admin", "instructor"), GetExams);

// fetched  spacefic Exam
router.get(
  "/GetExamByid/:id",
  validation(GetExamById),
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  GetExamByid
);

// update Exam by id
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("instructor"),
  UpdateExam
);

// Student get and write exam
router.post(
  "/takeExam/:id/:CourseId",
  validation(writeExam),
  isAuthenticated,
  isAuthorized("student"),
  TakeExam
);

// Delete Exam
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin", "instructor"),
  DeleteExam
);

// Update Exam staus
router.put(
  "/:examId",
  isAuthenticated,
  isAuthorized("admin"),
  updateExamStatus
);

module.exports = router;
