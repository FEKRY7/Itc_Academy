const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");

const {
  recordAbsences,
  getAbsencesForLecture,
} = require("./Absence.controller.js");

router.post(
  "/:groupId",
  isAuthenticated,
  isAuthorized("instructor"),
  recordAbsences
);

router.get(
  "/:lectureId",
  isAuthenticated,
  isAuthorized("instructor"),
  getAbsencesForLecture
);

module.exports = router;
