const jwt = require("jsonwebtoken");
const tokenModel = require("../../../Database/models/tokenModel.js");
const UserModel = require("../../../Database/models/user.model.js");
const bcryptjs = require("bcrypt");
const sendEmail = require("../../utils/sendEmail.js");
const signUpTemplate = require("../../utils/htmlTemplets.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const SignUp = async (req, res) => {
  try {
    // making sure that the used email dosent exist
    const isUser = await UserModel.findOne({ email: req.body.email });
    if (isUser) {
      return First(res, "User already existed", 409, http.FAIL);
    }
    // hashing the password
    req.body.password = bcryptjs.hashSync(req.body.password, 8);
    // Creating the token
    const token = jwt.sign(
      { email: req.body.email, id: req.body._id },
      process.env.JWT_SECRET_KEY
    );
    // Creating the user
    const user = await UserModel.create(req.body);
    const html = signUpTemplate(
      `http://localhost:3000/api/auth/activat_account/${token}`
    );
    const messageSent = await sendEmail({
      to: user.email,
      subject: "Account Activation",
      html,
    });
    if (!messageSent) {
      return First(res, "Failed to send activation email.", 400, http.FAIL);
    }
    Second(
      res,
      ["User Created , Pleasr activate your account", token],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const activeAccount = async (req, res) => {
  try {
    // receving the token from the params
    const { token } = req.params;
    // decoding the token to get the payload
    const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Searching for the user in DataBase
    const isUser = await UserModel.findOneAndUpdate(
      { email: payLoad.email },
      { confirmEmail: true },
      { new: true }
    );
    if (!isUser) {
      return First(res, "User not found.", 404, http.FAIL);
    }

    Second(
      res,
      ["Account Activated , Try to login ", isUser],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const signIn = async (req, res) => {
  try {
    // distructing the req.body
    const { email, password } = req.body;
    // searching for the user in database
    const isUser = await UserModel.findOne({ email });
    if (!isUser) {
      return First(res, "Invalid Email", 404, http.FAIL);
    }
    // making sure that the user has activated the account
    if (!isUser.confirmEmail) {
      return First(res, "Please Confirm your email", 400, http.FAIL);
    }
    // comparing the hashed password with the req.body password
    const match = await bcryptjs.compare(password, isUser.password);
    console.log(isUser);
    // sending a response if the passwords dosent match
    if (!match) {
      return First(res, "Invalid password", 400, http.FAIL);
    }
    // creating a token for using it in authentication and autorization
    const token = jwt.sign(
      { email, id: isUser._id },
      process.env.JWT_SECRET_KEY
    );
    // saving the token in token model (this an  optional  step)
    await tokenModel.create({ token, user: isUser._id });
    // sending the response
    return Second(res, ["you are loggedin", token], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const SendCode = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return First(res, "E-mail Not Exist", 401, http.FAIL);
    }
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = accessCode;
    await user.save();
    sendEmail({
      to: user.email,
      subject: `<h1> Access Code </h1>`,
      accessCode,
    });
    return Second(res, "Code Send Successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const ForgetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await UserModel.findOne({ email, code });

    if (!user) {
      return First(res, "User does not exist or invalid code", 401, http.FAIL);
    }
    const HashPassword = bcryptjs.hashSync(password, 8);

    const updateUser = await UserModel.findOneAndUpdate(
      { email },
      { code: "", password: HashPassword },
      { new: true }
    );
    if (updateUser) {
      return Second(
        res,
        ["Password reset successfully", updateUser],
        200,
        http.SUCCESS
      );
    } else {
      return First(res, "Failed to reset password", 400, http.FAIL);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpgradeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return First(res, "User not found", 404, http.FAIL);
    }

    if (
      newRole &&
      ["student", "admin", "instructor"].includes(newRole) &&
      user.role !== newRole
    ) {
      user.role = newRole;
      await user.save();

      return Second(
        res,
        ["User role upgraded successfully", { user: user.role }],
        200,
        http.SUCCESS
      );
    } else {
      return First(
        res,
        "Invalid new role or same as current role",
        400,
        http.FAIL
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetAllStududents = async (req, res) => {
  try {
    const Students = await UserModel.find({ role: "student" }).select(
      "-password -updatedAt -createdAt -confirmEmail "
    );
    if (!Students) {
      return First(res, "Not Found Any Users", 404, http.FAIL);
    }

    return Second(
      res,
      ["Student Data", { StudentData: Students }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  SignUp,
  activeAccount,
  signIn,
  SendCode,
  ForgetPassword,
  UpgradeUserRole,
  GetAllStududents,
};
