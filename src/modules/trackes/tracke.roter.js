const express = require("express");
const router = express.Router();
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");

const {
  createTrakes,
  getAllTraks,
  getSpecificTrake,
  updateTrake,
  deleteTrake,
} = require("./track.controller.js");

// Create categories
router.post(
  "/create/:serviceId",
  myMulter(pathName.createtracke).single("image"),
  HME,
  createTrakes
);

// Get all categories
router.get("/AllTrakes", getAllTraks);
 
// Get specific category by ID
router.get("/:id", getSpecificTrake);

// Update category by ID
router.put(
  "/:id",
  myMulter(pathName.createtracke).single("image"),
  HME,
  updateTrake
);

// Delete category by ID
router.delete("/:id", deleteTrake);

module.exports = router;
