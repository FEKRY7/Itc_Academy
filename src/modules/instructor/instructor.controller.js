const UserModel = require("../../../Database/models/user.model.js");
const { deleteOldImage } = require("../../utils/fileUpload.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const UpdateInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const Instructor = await UserModel.findById(id);
    if (!Instructor) {
      return First(res, "instructor not found", 404, http.FAIL);
    }

    if (req.file) {
      if (Instructor.imageUrl) {
        await deleteOldImage(Instructor.imageUrl);
      }

      req.body.imageId = req.file.filename;
      req.body.imageUrl = req.file.path;
    }
    const instructor = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!instructor) {
      return First(res, "instructor not found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Instructor updated successfully", { data: instructor }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Function to activate an instructor by admin
const activateInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { ActiveStatus } = req.body;
    const user = await UserModel.findById(instructorId);

    if (user && user.role === "instructor") {
      user.active = ActiveStatus;
      await user.save();

      return Second(
        res,
        "Instructor activated successfully",
        { InstructorId: user._id },
        200,
        http.SUCCESS
      );
    } else {
      return First(
        res,
        "Instructor not found or already active",
        404,
        http.FAIL
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getInstructor = async (req, res, next) => {
  try {
    const instructors = await UserModel.find();
    if (!instructors) {
      return First(res, "Not found instructors Data", 404, http.FAIL);
    }

    return Second(
      res,
      ["instructors Data", { data: instructors }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getInstructorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const instructor = await UserModel.findById(id);
    if (!instructor) {
      return First(res, "instructor not found", 404, http.FAIL);
    }

    return Second(
      res,
      ["instructors Data", { data: instructor }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await UserModel.findById(id);

    if (!instructor) {
      return First(res, "instructor not found", 404, http.FAIL);
    }

    if (instructor.imageUrl) {
      await deleteOldImage(instructor.imageUrl);
    }

    await instructor.remove();

    return Second(res, "Instructor deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  UpdateInstructor,
  activateInstructor,
  getInstructor,
  getInstructorById,
  DeleteInstructor,
};
