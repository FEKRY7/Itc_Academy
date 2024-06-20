const express = require("express");
const router = express.Router();
const { validation } = require("./../../middleware/validation.middleware.js");
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");

const {
  SignUpSchema,
  activateAcountSchema,
  signInSchema,
} = require("./auth.schema..js");
const {
  SignUp,
  activeAccount,
  signIn,
  SendCode,
  ForgetPassword,
  UpgradeUserRole,
  GetAllStududents,
} = require("./auth.controller.js");

router.post("/SignUp", validation(SignUpSchema), SignUp);

router.get(
  "/activat_account/:token",
  validation(activateAcountSchema),
  activeAccount
);
 
router.post("/signIn", validation(signInSchema), signIn);

router.post("/sendCode", SendCode);

router.put("/forgetPassword", ForgetPassword);

router.put(
  "/upgrade-role/:userId",
  isAuthenticated,
  isAuthorized("admin"),
  UpgradeUserRole
);
router.get(
  "/students",
  isAuthenticated,
  isAuthorized("admin"),
  GetAllStududents
);

module.exports = router;
