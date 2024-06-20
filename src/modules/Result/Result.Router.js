const express = require("express");
const router = express.Router({ mergeParams: true }); // internal navigate

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  publishedExsamResult,
  checkExsamResult,
} = require("./resualt.Validation.js");

const {
  checkExamResult,
  publishedExamResult,
} = require("./ExamResualt.Controller.js");

//ExamResult routers
router.get(
  "/:examId",
  validation(checkExsamResult),
  isAuthenticated,
  isAuthorized("student"),
  checkExamResult
);

router.put(
  "/:id",
  validation(publishedExsamResult),
  isAuthenticated,
  isAuthorized("admin"),
  publishedExamResult
);

module.exports = router;
