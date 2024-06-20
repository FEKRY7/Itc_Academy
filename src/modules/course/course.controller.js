const CourseModel = require("../../../Database/models/course.model.js");
const { deleteOldImage } = require("../../utils/fileUpload.js");
const fs = require("fs");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const CreateCourse = async (req, res, next) => {
  try {
    if (!req.file) {
      throw First(res, "Image is required", 404, http.FAIL);
    }
    const course_imageId = req.file.filename;
    const course_imageUrl = req.file.path;
    const { title, description, instructorId, total_duration, price } =
      req.body;
    const CreatedBy = req.user._id;

    const newCourse = new CourseModel({
      title,
      course_imageId,
      description,
      serviceId: req.params.serviceId,
      total_duration,
      instructorId,
      course_imageUrl,
      price,
      CreatedBy,
    });

    const savedCourse = await newCourse.save();
    if (!savedCourse) {
      return First(res, "cach_error", 404, http.FAIL);
    }
    return Second(
      res,
      [" coures has been created successfuly ", savedCourse],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findOne({
      _id: id,
      CreatedBy: req.user._id,
    });

    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }
    if (req.file) {
      const image = req.file;
      const course_imageId = image.filename;
      const course_imageUrl = image.path;

      // Assign new image details to request body
      req.body.course_imageId = course_imageId;
      req.body.course_imageUrl = course_imageUrl;

      if (fs.existsSync(course.course_imageUrl)) {
        await fs.promises.unlink(course.course_imageUrl);
        console.log("Old Image Deleted Successfully");
      } else {
        console.log("Old Image File Not Found");
      }
    }
    const updatedCourse = await CourseModel.findOneAndUpdate(
      { _id: id, CreatedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      throw First(res, "Failed to update Course", 404, http.FAIL);
    } else {
      return Second(
        res,
        ["Updated Course", { data: updatedCourse }],
        200,
        http.SUCCESS
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await CourseModel.find({ approved: true });
    if (!courses || courses.length === 0) {
      return First(res, "No courses found", 404, http.FAIL);
    }
    return Second(
      res,
      ["Courses retrieved successfully", { data: courses }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(id);

    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Course retrieved successfully", { data: course }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findOne({
      _id: id,
      CreatedBy: req.user._id,
    });

    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }
    await deleteOldImage(course.course_imageUrl);

    await CourseModel.findByIdAndDelete(id);

    return Second(res, "Course deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateCourseApprovalStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { approvalStatus } = req.body;
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }
    course.approved = approvalStatus;
    await course.save();
    return Second(res, "Course approved successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const review = async (req, res) => {
  const { CourseId } = req.params;
  const { _id: studentId } = req.user;
  const { text } = req.body;

  try {
    const course = await CourseModel.findById(CourseId);
    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }

    // Check if the student is enrolled in the course
    const isEnrolled = course.students_enrolled.some((enrolledStudentId) =>
      enrolledStudentId.equals(studentId)
    );
    if (!isEnrolled) {
      return First(res, "You are not enrolled in this course", 403, http.FAIL);
    }

    // Add the review to the course
    course.reviews.push({ student: studentId, text });
    await course.save();

    return Second(res, "Review added successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const rating = async (req, res) => {
  const { CourseId } = req.params;
  const { _id: studentId } = req.user;
  const { rating } = req.body;

  try {
    const course = await CourseModel.findById(CourseId);
    if (!course) {
      return First(res, "Course not found", 404, http.FAIL);
    }

    const isEnrolled = course.students_enrolled.some((enrolledStudentId) =>
      enrolledStudentId.equals(studentId)
    );
    if (!isEnrolled) {
      return First(res, "You are not enrolled in this course", 403, http.FAIL);
    }

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return First(
        res,
        "Rating must be a number between 0 and 5",
        400,
        http.FAIL
      );
    }

    // Update the course rating
    course.rating = rating;
    await course.save();

    return Second(res, "Course rating updated successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateCourse,
  UpdateCourse,
  getCourses,
  getCourseById,
  deleteCourseById,
  updateCourseApprovalStatus,
  rating,
  review,
};
