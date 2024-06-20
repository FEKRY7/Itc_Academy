const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");

const { validation } = require("../../middleware/validation.middleware.js");

const {
  UpdateQuestion,
  GetQuestionById,
  createQuestion,
} = require("./Question.Validation.js");

const {
  CraeteQuestion,
  GetQuestions,
  GetSingleQuestion,
  UpdateQuestions,
  DeleteQuestion,
} = require("./Question.controler.js");

//Question routers
router.post(
  "/:id",
  validation(createQuestion),
  isAuthenticated,
  isAuthorized("instructor"),
  CraeteQuestion
);

router.get(
  "/:examId",
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  GetQuestions
);

router.get(
  "/:id",
  validation(GetQuestionById),
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  GetSingleQuestion
);

router.put(
  "/:id",
  validation(UpdateQuestion),
  isAuthenticated,
  isAuthorized("instructor"),
  UpdateQuestions
);

router.delete(
  "/:examId/:id",
  isAuthenticated,
  isAuthorized("instructor"),
  DeleteQuestion
);

module.exports = router;
