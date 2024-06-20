const mongoose = require("mongoose");

const { Types } = mongoose;

const SessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date},
  time: { type: String, required: true },
  CreatedBy: { 
    type: Types.ObjectId,
    ref: "user",

  },  
  groupId: {
    type: Types.ObjectId,
    ref: "Group",

  }, 
}); 

const SessionModel = mongoose.model("Session", SessionSchema);

module.exports = SessionModel;
