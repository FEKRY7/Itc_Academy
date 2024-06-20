const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

//joi validation for ExsamResult

const publishedExsamResult = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

//joi validation for  check ExsamResult

const checkExsamResult = joi.object({
  examId: joi.string().required().min(24),
});

//joi validation for fetch ExsamResul

const fetchExsamResult = joi.object({
  id: joi.string().custom(isValidObjectId).required(),
});

module.exports = {
  publishedExsamResult,
  checkExsamResult,
  fetchExsamResult,
};
