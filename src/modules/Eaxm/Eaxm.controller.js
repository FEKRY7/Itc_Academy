const UserModel = require("../../../Database/models/user.model.js");
const ExamModel = require("../../../Database/models/Exams.model.js");
const ExamResultModel = require("../../../Database/models/ExamResualt.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const CreatExam = async (req, res, next) => {
  try {
    // check Teacher found
    const Instructor = await UserModel.findById(req.user._id);
    if (!Instructor) {
      return First(res, "Instructor not found", 404, http.FAIL);
    } else {
      req.body.Createdby = req.user._id;
      req.body.CourseId = req.params.CourseId;
      const NewExam = await ExamModel.create(req.body);
      await Instructor.exams.push(NewExam._id);
      Instructor.save();

      return Second(
        res,
        ["exam is created successfully", NewExam],
        200,
        http.SUCCESS
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetExams = async (req, res, next) => {
  try {
    const exams = await ExamModel.find({
      CourseId: req.params.CourseId,
      examStatus: "live",
    }).populate({
      path: "Questions",
      model: "Question",
      select: "-correctAnswer -Incorrect -updatedAt -createdAt",
      populate: {
        path: "CreatedBy",
        select: "name",
      },
    });

    if (!exams || exams.length === 0) {
      return First(res, "No exams found or exam still pending", 404, http.FAIL);
    }
    return Second(
      res,
      ["all exams and related questions", exams],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetExamByid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Exam = await ExamModel.findById({ _id: id }).populate({
      path: "Questions",
      model: "Question",
      select: "-correctAnswer -Incorrect -updatedAt -createdAt",
      populate: {
        path: "CreatedBy",
        select: "name",
      },
    });

    if (!Exam) {
      return First(
        res,
        `Not found Exam with id: ${req.params.id}`,
        404,
        http.FAIL
      );
    }

    if (Exam.examStatus === "pending") {
      return First(res, "Exam is still pending", 404, http.FAIL);
    }
    return Second(res, ["This is the Exam", Exam], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateExam = async (req, res, next) => {
  try {
    const Exam = await ExamModel.findById({
      _id: req.params.id,
      Createdby: req.user._id,
    });
    if (!Exam) {
      return First(
        res,
        `not found Exam  with id: ${req.params.id}`,
        404,
        http.FAIL
      );
    } else {
      const UpdateExam = await ExamModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return Second(res, [" Exam Updated", UpdateExam], 200, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const TakeExam = async (req, res, next) => {
  try {
    // Find student
    const student = await UserModel.findOne({ _id: req.user._id });
    if (!student) {
      return First(res, "Student not found", 404, http.FAIL);
    }

    // Find exam
    const exam = await ExamModel.findOne({
      _id: req.params.id,
      CourseId: req.params.CourseId,
    }).populate({
      path: "Questions",
      model: "Question",
      select: "-updatedAt -createdAt",
      populate: {
        path: "CreatedBy",
        select: "name",
      },
    });

    if (!exam) {
      return First(res, "Exam not found", 404, http.FAIL);
    }

    const questions = exam.Questions;

    // Check if the exam result already exists for the student
    const existingResult = await ExamResultModel.findOne({
      studentId: student._id,
      ExamId: exam._id,
    });
    if (existingResult) {
      return First(res, "You have already taken this exam", 400, http.FAIL);
    }

    // Validate student answers
    const studentAnswers = req.body.Answers;
    if (
      !Array.isArray(studentAnswers) ||
      questions.length !== studentAnswers.length
    ) {
      return First(res, "You have not answered all questions", 404, http.FAIL);
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let score = 0;
    let grade = 0;
    let status = "";
    let remark = "";

    // Evaluate answers
    const answeredQuestions = questions.map((question, index) => {
      const isCorrect = question.correctAnswer === studentAnswers[index];
      if (isCorrect) {
        correctAnswers++;
        score++;
      } else {
        wrongAnswers++;
      }

      return {
        question: question.question,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    // Calculate grade and status
    const totalQuestions = questions.length;
    grade = (correctAnswers / totalQuestions) * 100;
    status = grade >= 50 ? "passed" : "failed";

    // Determine remark based on grade
    if (grade >= 80) {
      remark = "Excellent";
    } else if (grade >= 70) {
      remark = "Very good";
    } else if (grade >= 60) {
      remark = "Good";
    } else if (grade >= 50) {
      remark = "Fair";
    } else {
      remark = "Poor";
    }

    // Create exam result
    const examResult = await ExamResultModel.create({
      ExamId: exam._id,
      studentId: student._id,
      grade,
      score,
      remark,
      status,
      answeredQuestions,
    });

    // Add result to student's exam results and save
    student.examResults.push(examResult._id);
    await student.save();

    return Second(
      res,
      [
        "You have submitted the exam. Check back later for results.",
        examResult,
      ],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateExamStatus = async (req, res, next) => {
  try {
    const { ExamId } = req.params.examId;
    const { ExamStatus } = req.body;
    const Exam = await ExamModel.findOne({ ExamId, examStatus: "pending" });
    if (!Exam) {
      return First(res, "exam not found or it aready live", 404, http.FAIL);
    }
    Exam.examStatus = ExamStatus;
    await Exam.save();
    return Second(
      res,
      ["examStatus updeated successfully", { examStatus: Exam.examStatus }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const deletedExam = await ExamModel.findOneAndDelete({ _id: examId });

    if (deletedExam) {
      return Second(res, "Exam deleted successfully.", 200, http.SUCCESS);
    } else {
      return First(res, "Exam not found.", 404, http.FAIL);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreatExam,
  GetExams,
  GetExamByid,
  UpdateExam,
  TakeExam,
  DeleteExam,
  updateExamStatus,
};
