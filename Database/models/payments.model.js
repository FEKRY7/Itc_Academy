const mongoose = require('mongoose')

const {Types} = mongoose

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    CoursePrice: {
      type: Number,
    },
    remainingAmount: {
      type: Number,
    },
    payments: [
      {
        amount: {
          type: Number,
          required: true,
        },
        paymentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Remove _id from each payment object
        ret.payments = ret.payments.map((payment) => {
          return {
            amount: payment.amount,
            paymentDate: payment.paymentDate,
          };
        });
      },
    },
  }
);

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports = PaymentModel;
