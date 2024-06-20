const express = require("express");
const router = express.Router();

const {
  payment,
  findStudentPayments,
  FindCoursePayments,
} = require("./payment.controller.js");

router.post("/", payment);
router.get("/StudentPayment", findStudentPayments);
router.get("/coursePayment/:courseId", FindCoursePayments);

module.exports = router;
