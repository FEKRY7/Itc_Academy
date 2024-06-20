const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");

const {
    createGroup,
    addStudentsToGroup,
    addMaterialsToGroup,
    updateGroup,
    getGroups,
    getGroupById,
    deleteStudentFromGroup,
    deleteMaterialFromGroup,
    deleteGroup,
    getStudentsInGroup,
    getMaterialsByUserInGroup
} = require('./group.controller.js')

// import  from "../Session/Session.router.js";
const SessionRouter = require('../Session/Session.router.js')

router.use("/:groupId/Session", SessionRouter); // internal navigate

// Create group
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  createGroup
);

// Add students to the group
router.post(
  "/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  addStudentsToGroup
);

// Add Materials to the group
router.post(
  "/:groupId/:materials",
  isAuthenticated,
  isAuthorized("admin"),
  addMaterialsToGroup
);

// Update group
router.put(
  "/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  updateGroup
);

// get all groups
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  getGroups
);

// get group by id
router.get(
  "/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  getGroupById
);

// delete student from group
router.delete(
  "/students/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  deleteStudentFromGroup
);

// delete material from group
router.delete(
  "/Material/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  deleteMaterialFromGroup
);

// delete group
router.delete(
  "/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  deleteGroup
);

// get students in the group
router.get(
  "/students/:groupId",
  isAuthenticated,
  isAuthorized("admin"),
  getStudentsInGroup
);

// get material in group
router.get(
  "/Material/:groupId",
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  getMaterialsByUserInGroup
);

module.exports = router;
