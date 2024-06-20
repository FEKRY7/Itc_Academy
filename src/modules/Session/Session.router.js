const express = require("express");
const router = express.Router({ mergeParams: true });
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const {
  CreateSession,
  getNextSessionInGroup,
  deleteSessionFromGroup,
  getAllSessionInGroup
} = require("./Session.controller.js");
  
router.post("/:groupId", isAuthenticated, isAuthorized("instructor"), CreateSession);
router.get(
  "/:groupId",
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  getNextSessionInGroup
);

router.get(
    "/getAll/:groupId",
    isAuthenticated,
    isAuthorized("student", "admin", "instructor"),
    getAllSessionInGroup
);

router.delete(
  "/:groupId/:sessionId",
  isAuthenticated,
  isAuthorized("admin", "instructor"),
  deleteSessionFromGroup
);

module.exports = router;
