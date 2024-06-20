const GroupModel = require("../../../Database/models/Group.model.js");
const SessionModel = require("../../../Database/models/session.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const CreateSession = async (req, res, next) => {
  try {
    const { title, date, time } = req.body;
    const CreatedBy = req.user._id;
    const groupId = req.params.groupId;

    // Check if the group exists
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    // Convert date string to Date object
    const formattedDate = new Date();

    // Check if the date is valid
    if (isNaN(formattedDate.getTime())) {
      return First(res, "Invalid date format", 400, http.FAIL);
    }

    // Create a new session instance
    const newSession = new SessionModel({
      title,
      date: formattedDate,
      time,
      CreatedBy,
      groupId,
    });

    // Save the session to the database
    const savedSession = await newSession.save();
    if (!savedSession) {
      return First(res, "Create session failed", 404, http.FAIL);
    }

    // Add the session ID to the group's sessions
    group.Sessions.push(savedSession._id);
    await group.save();

    return Second(
      res,
      ["Session created successfully", { data: savedSession }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getNextSessionInGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id; // Assuming userId is available in the request object after authentication

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    const isInGroup =
      group.studentId.some((studentId) => studentId.equals(userId)) ||
      group.instructor.equals(userId) ||
      (req.user.role = "Admin");
    if (!isInGroup) {
      return First(
        res,
        "You are not authorized to access this resource",
        403,
        http.FAIL
      );
    }

    // Query sessions belonging to the group and sort them by date in descending order
    const lastSession = await SessionModel.findOne({ groupId })
      .sort({ date: -1 }) // Sort sessions by date in descending order
      .exec();

    if (!lastSession) {
      return First(res, "No sessions found for this group", 400, http.FAIL);
    }

    return Second(
      res,
      ["The next session for this group:", { data: lastSession }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteSessionFromGroup = async (req, res) => {
  try {
    const { groupId, sessionId } = req.params;
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }
    const session = await SessionModel.findById(sessionId);
    if (!session || session.groupId.toString() !== groupId) {
      return First(res, "Session not found in this group", 404, http.FAIL);
    }
    // Remove session from the group's sessions array
    await GroupModel.findByIdAndUpdate(groupId, {
      $pull: { sessions: sessionId },
    });

    const removedSession = await SessionModel.findByIdAndDelete(sessionId);

    return Second(
      res,
      ["Session deleted successfully", removedSession],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAllSessionInGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    const isInGroup =
      group.studentId.some((studentId) => studentId.equals(userId)) ||
      group.instructor.equals(userId) ||
      (req.user.role = "Admin");
    if (!isInGroup) {
      return First(
        res,
        "You are not authorized to access this resource",
        403,
        http.FAIL
      );
    }

    const Sessions = await SessionModel.find({ groupId });

    if (!Sessions) {
      return First(res, "No sessions found for this group", 404, http.FAIL);
    }

    return Second(
      res,
      ["The next session for this group:", { data: Sessions }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateSession,
  getNextSessionInGroup,
  deleteSessionFromGroup,
  getAllSessionInGroup,
};
