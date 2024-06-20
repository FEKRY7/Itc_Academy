const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

// joi validation for Creating/Updating Question
const UpdateQuestion = joi
  .object({
    Question: joi.string().required(),
    optionA: joi.string().required(),
    optionB: joi.string().required(),
    optionC: joi.string().required(),
    optionD: joi.string().required(),
    correctAnswer: joi.string().required(),
  })
  .required();

// joi validation for Getting Question by ID
const GetQuestionById = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// joi validation for Creating Question
const createQuestion = joi
  .object({
    Question: joi.string().required(),
    optionA: joi.string().required(),
    optionB: joi.string().required(),
    optionC: joi.string().required(),
    optionD: joi.string().required(),
    correctAnswer: joi.string().required(),
  })
  .required();

module.exports = {
  UpdateQuestion,
  GetQuestionById,
  createQuestion,
};
