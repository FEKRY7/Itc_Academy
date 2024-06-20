const UserModel = require("../../../Database/models/user.model.js");
const ExamResultModel = require("../../../Database/models/ExamResualt.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const {First,Second,Third} = require("../../utils/httperespons.js");

const checkExamResult = async (req, res, next) => {
try{
  const StudentFound = await UserModel.findById(req.user._id);
  if (!StudentFound) {
    return First(res, "Student not registered", 404, http.FAIL);
  }

  const examResult = await ExamResultModel.findOne({
    studentId: req.user._id,
    ExamId: req.params.examId,
  }).populate({
    path: "ExamId",
    populate: {
      path: "Questions",
      select: "Question",
    },
  });
  if (!examResult) {
    return First(res, "Exam result not found", 404, http.FAIL);
  }
  if (!examResult.IsPublished) {
    return First(res, "Exam result not published yet. Please check back later.", 403, http.FAIL);
  } else {
    return Second(res, ["Exam result retrieved successfully", examResult], 200, http.SUCCESS);
  }
}catch (error) {
  console.error(error);
  return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

// Admin obscure Results
const publishedExamResult = async (req, res, next) => {
try{
  const examResult = await ExamResultModel.findById(req.params.id);
  if (!examResult) {
    return First(res, "Exam result not found", 404, http.FAIL);
  } else {
    const obscure = await ExamResultModel.findByIdAndUpdate(
      req.params.id,
      { IsPublished: true },
      { new: true }
    );

    return Second(res, ["Done your Result ", obscure], 200, http.SUCCESS);
  }
}catch (error) {
  console.error(error);
  return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

module.exports = {
  checkExamResult,
  publishedExamResult,
};
