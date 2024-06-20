const CourseModel = require("../../../Database/models/course.model.js");
const PaymentModel = require("../../../Database/models/payments.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const payment = async (req, res, next) => {
try{
    const { studentId, courseId, paymentAmount } = req.body;

    let payment = await PaymentModel.findOne({ studentId, courseId });
    const course = await CourseModel.findById(courseId);
  
    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }
    if (payment && payment.remainingAmount === 0) {
        return First(res, "The course has already been fully paid", 400, http.FAIL);
    }
    if (payment && payment.remainingAmount < paymentAmount) {
        return First(res, `The remainingAmount only ${payment.remainingAmount}`, 400, http.FAIL);
    }
  
    if (!payment) {
      payment = new PaymentModel({
        studentId,
        courseId,
        CoursePrice: course.price,
        remainingAmount: course.price - paymentAmount,
        payments: [
          {
            amount: paymentAmount,
            paymentDate: new Date(),
          },
        ],
      });
    } else {
      payment.payments.push({
        amount: paymentAmount,
        paymentDate: new Date(),
      });
      payment.remainingAmount =
        course.price -
        payment.payments.reduce((total, payment) => total + payment.amount, 0);
    }
  
    await payment.save();
  
    return Second(res, ["Payment added", payment], 200, http.SUCCESS);

}catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

const findStudentPayments = async (req, res) => {
try{
    const { studentId, courseId } = req.body;

    const payment = await PaymentModel.findOne({ studentId, courseId });
    if (!payment || payment.length === 0) {
        return First(res, "No payments found for this student", 404, http.FAIL);
    }

    return Second(res, ["student payments", {data: payment}], 200, http.SUCCESS);
}catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

const FindCoursePayments = async (req, res) => {
try{
    const { courseId } = req.params;

    const payments = await PaymentModel.find({ courseId });
    if (!payments || payments.length === 0) {
        return First(res, "No payments found for this student", 404, http.FAIL);
    }

    return Second(res, ["student payments", {data: payments}], 200, http.SUCCESS);

}catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

module.exports = {
  payment,
  findStudentPayments,
  FindCoursePayments,
};
