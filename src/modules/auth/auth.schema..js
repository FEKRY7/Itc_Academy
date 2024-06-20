const joi = require("joi");

const SignUpSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required().email(),
    phone: joi
      .string()
      .pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/)
      .required(),
    password: joi.string().required(),
    cpassword: joi.string().required().valid(joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
  })
  .required();

const activateAcountSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  SignUpSchema,
  activateAcountSchema,
  signInSchema,
};
