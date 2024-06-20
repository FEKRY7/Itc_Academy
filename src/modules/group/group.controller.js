const GroupModel = require("../../../Database/models/Group.model.js");
const CourseModel = require("../../../Database/models/course.model.js");
const UserModel = require("../../../Database/models/user.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const createGroup = async (req, res, next) => {
  try {
    const instructor = await UserModel.findById(req.body.instructor);
    if (!instructor) {
      return First(res, "Instructor not found", 400, http.FAIL);
    }
    const existingGroup = await GroupModel.findOne({ code: req.body.code });
    if (existingGroup) {
      return First(
        res,
        `Group with this code ${req.body.code} already exists`,
        404,
        http.FAIL
      );
    }
    const groupData = {
      code: req.body.code,
      name: req.body.name,
      instructor: req.body.instructor,
    };

    const group = await GroupModel.create(groupData);

    return Second(
      res,
      ["group created successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const addStudentsToGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findById(req.params.groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    let studentIds = req.body.studentId;
    if (!studentIds) {
      return First(res, "No students provided", 400, http.FAIL);
    }

    // Ensure studentIds is an array
    if (!Array.isArray(studentIds)) {
      studentIds = [studentIds];
    }

    // Find all students in parallel
    const students = await Promise.all(
      studentIds.map((studentId) => UserModel.findById(studentId))
    );

    // Check if any student was not found
    const notFoundStudents = studentIds.filter(
      (studentId, index) => !students[index]
    );
    if (notFoundStudents.length > 0) {
      return First(
        res,
        `Student(s) with ID(s) ${notFoundStudents.join(", ")} not found`,
        404,
        http.FAIL
      );
    }

    // Initialize the students array if it's not already an array
    if (!Array.isArray(group.studentId)) {
      group.studentId = [];
    }

    group.studentId.push(...studentIds);
    await group.save();

    return Second(
      res,
      ["Students added to the group successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const addMaterialsToGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findById(req.params.groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    let materialIds = req.body.materials;
    if (!materialIds) {
      return First(res, "No materials provided", 400, http.FAIL);
    }

    // Ensure materialIds is an array
    if (!Array.isArray(materialIds)) {
      materialIds = [materialIds];
    }

    // Fetch all materials in a single query
    const materials = await CourseModel.find({ _id: { $in: materialIds } });
    const existingMaterialIds = materials.map((material) =>
      material._id.toString()
    );

    // Check for missing materials
    const notFoundMaterials = materialIds.filter(
      (id) => !existingMaterialIds.includes(id)
    );
    if (notFoundMaterials.length > 0) {
      return First(
        res,
        `Material(s) with ID(s) ${notFoundMaterials.join(", ")} not found`,
        404,
        http.FAIL
      );
    }

    // Initialize the materials array if it's not already an array
    if (!Array.isArray(group.materials)) {
      group.materials = [];
    }

    group.materials.push(...existingMaterialIds);
    await group.save();

    return Second(
      res,
      ["Materials added to the group successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findById(req.params.groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    if (req.body.instructor) {
      const newInstructor = await UserModel.findById(req.body.instructor);
      if (!newInstructor) {
        return First(res, "New instructor not found", 400, http.FAIL);
      }
      group.instructor = req.body.instructor;
    }

    if (req.body.name) {
      group.name = req.body.name;
    }

    await group.save();

    return Second(
      res,
      ["Group updated successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const groups = await GroupModel.find()
      .populate({
        path: "students",
        model: "user",
        select: "firstName lastName email",
      })
      .populate({ path: "materials", model: "Course", select: "title" })
      .exec();

    return Second(res, ["Groups data", { data: groups }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const group = await GroupModel.findById(req.params.groupId)
      .populate({ path: "students", select: "name email" })
      .populate({ path: "materials", select: "title" })
      .exec();

    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    return Second(res, ["Groups data", { data: groups }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findByIdAndDelete(req.params.groupId);
    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    return Second(res, "Group deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteStudentFromGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { studentId: req.body.studentIds } },
      { new: true }
    );

    if (!group) {
      return First(
        res,
        "Group not found or studentId not found in the group",
        404,
        http.FAIL
      );
    }

    return Second(
      res,
      ["Student removed from the group successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteMaterialFromGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { materials: req.body.materialId } },
      { new: true }
    );

    if (!group) {
      return First(
        res,
        "Group not found or materialId not found in the group",
        404,
        http.FAIL
      );
    }

    return Second(
      res,
      ["Material removed from the group successfully", { data: group }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getStudentsInGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.findById(req.params.groupId)
      .populate("students", "firstName lastName email")
      .exec();

    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    return Second(res, { data: group.studentId }, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getMaterialsByUserInGroup = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;

    const group = await GroupModel.findById(req.params.groupId)
      .populate({
        path: "materials",
        model: "Course",
        select: "title course_imageId description lectureIds",
        populate: {
          path: "lectureIds",
          model: "lecture",
          select: "-_id -CourseId -CreatedBy -objectives",
        },
      })
      .exec();

    if (!group) {
      return First(res, "Group not found", 404, http.FAIL);
    }

    const isAuthorized =
      group.studentId.some(
        (student) => student._id.toString() === authenticatedUserId
      ) ||
      group.instructor.toString() === authenticatedUserId ||
      req.user.role === "admin";

    if (!isAuthorized) {
      return First(
        res,
        "You are not authorized to access materials in this group",
        403,
        http.FAIL
      );
    }

    const materials = group.materials;

    return Second(res, materials, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createGroup,
  addStudentsToGroup,
  addMaterialsToGroup,
  updateGroup,
  getGroups,
  getGroupById,
  deleteStudentFromGroup,
  deleteMaterialFromGroup,
  deleteGroup,
  getStudentsInGroup,
  getMaterialsByUserInGroup,
};
