const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");

const {
  UpdateInstructor,
  activateInstructor,
  getInstructor,
  getInstructorById,
  DeleteInstructor,
} = require("./instructor.controller.js");

router.put(
  "/update/:id",
  myMulter(pathName.Instructor).single("image"),
  HME,
  UpdateInstructor
);
 
router.put(
  "/:instructorId",
  isAuthenticated,
  isAuthorized("admin"),
  activateInstructor
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  getInstructor
);

router.get("/:id", getInstructorById);

router.delete("/:id", isAuthenticated, isAuthorized("admin"), DeleteInstructor);

module.exports = router;
