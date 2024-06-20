const GroupModel = require('../../../Database/models/Group.model.js')
const ReviewModel = require('../../../Database/models/review.model.js')
const http = require("../../folderS,F,E/S,F,E.JS");
const {First,Second,Third} = require("../../utils/httperespons.js");

const review = async (req, res, next) => {
try{
  const studentId = req.user._id;
  console.log(studentId);

  const {
    courseMaterialRating,
    instructorRating,
    placeRating,
    groupId,
    comments,
  } = req.body;

  const group = await GroupModel.findById(groupId);
  if (!group) {
    return First(res, "group not found", 404, http.FAIL);
  }

  const studentExists = group.studentId.includes(studentId);
  if (!studentExists) {
    return First(res, "Student is not part of the group", 400, http.FAIL);
  }

  const checkreview = await ReviewModel.findOne({ studentId, groupId });
  if (checkreview) {
    return First(res, "you are aready review", 400, http.FAIL);
  }

  const review = await ReviewModel.create({
    GroupId: groupId,
    studentId,
    instructorId: group.instructor,
    CourseId: group.materials,
    courseMaterialRating,
    instructorRating,
    placeRating,
    GroupCode: group.code,
    comments,
  });


  return Second(res, ["review Add Successfuly", review], 200, http.SUCCESS);

}catch (error) {
  console.error(error);
  return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

const Getreview = async (req, res, next) => {
try{
  const { courseId } = req.params;

  const checkReview = await ReviewModel.find({ CourseId: courseId })
    .populate("instructorId", "firstName -_id")
    .populate("CourseId", "title , course_imageId , description -_id")
    .select("-createdAt -updatedAt -GroupCode");

  if (checkReview.length === 0) {
    return First(res, "No reviews found for this course", 404, http.FAIL);
  }

    return Second(res, [`review for ${courseId}`, checkReview], 200, http.SUCCESS);

}catch (error) {
  console.error(error);
  return Third(res, "Internal Server Error", 500, http.ERROR);
}
};

module.exports = {
    review, 
    Getreview
}