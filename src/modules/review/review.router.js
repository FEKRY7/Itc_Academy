const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");

const { review, Getreview } = require("./review.controller.js");

router.post("/", isAuthenticated, isAuthorized("student"), review);

router.get("/:courseId", Getreview);

module.exports = router;
