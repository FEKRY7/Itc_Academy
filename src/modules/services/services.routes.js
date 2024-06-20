const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");
const {
  createService,
  getAllServices,
  getSpecificService,
  updateService,
  deleteService,
  setRecommendedStatusForService,
} = require("./services.controller.js");

router.post(
  "/create/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  myMulter(pathName.serviceFiles).single("image"),
  HME,
  createService
);
router.get("/services/:categoryId", getAllServices);
router.get("/:id", getSpecificService);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  myMulter(pathName.serviceFiles).single("image"),
  HME,
  updateService
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("student", "admin", "instructor"),
  deleteService
);
router.put(
  "/recommended/:serviceId",
  isAuthenticated,
  isAuthorized("admin"),
  setRecommendedStatusForService
);

module.exports = router;
