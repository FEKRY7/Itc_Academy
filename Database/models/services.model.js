const mongoose = require('mongoose')

const {Types} = mongoose

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "category",
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    image: String,
    imageUrl: String,
    typeOfService: {
      type: String,
      enum: ["Course", "trak"]
    },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model("service", serviceSchema);

module.exports = ServiceModel;
