const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

//joi validation for creating Exam
const CreateExam = joi
  .object({
    title: joi.string().required().messages({
      "any.required": "title is required",
    }),
    duration: joi.string().required(),
    description: joi.string(),
    examType: joi.string().required(),
    totalMark: joi.number().required(),
    passMark: joi.number().required(),
    CourseId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
//joi validation for get Exam

const GetExamById = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    CourseId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

//joi validation for write exam

const writeExam = joi
  .object({
    id: joi.string().custom(isValidObjectId).required().messages({
      "any.required": "id is required",
    }),
    CourseId: joi.string().custom(isValidObjectId).required().messages({
      "any.required": "courseId is required",
    }),
    Answers: joi.array().required(),
  })
  .required();

module.exports = {
    CreateExam,
    GetExamById,
    writeExam
};
