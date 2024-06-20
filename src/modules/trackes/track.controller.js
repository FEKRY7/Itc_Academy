const CategoryModel = require("../../../Database/models/category.model.js");
const TrackModel = require("../../../Database/models/track.model.js");
const fs = require("fs");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const createTrakes = async (req, res, next) => {
  try {
    // Check if an image file is provided
    if (!req.file || !req.file.path) {
      return First(res, "Image is required", 400, http.FAIL);
    }

    // Find the category by ID
    const category = await CategoryModel.findById(req.body.categoryId);
    if (!category) {
      return First(res, "Category Not Found", 404, http.FAIL);
    }

    // Get the image path from the file upload
    const image = req.file;
    const newImageUrl = image.path;
    req.body.track_image = newImageUrl;
    req.body.serviceId = req.params.serviceId;

    // Create a new track
    const track = new TrackModel(req.body);
    await track.save();

    // Respond with success message and data
    return Second(res, ["Success", { data: track }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAllTraks = async (req, res) => {
  try {
    const Traks = await TrackModel.find({});
    if (!Traks) {
      return First(res, "Trak Not Found", 404, http.FAIL);
    }

    return Second(
      res,
      ["this is All Traks", { data: Traks }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getSpecificTrake = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Trak = await TrackModel.findById(id);
    if (!Trak) {
      return First(res, "Trak Not Found", 404, http.FAIL);
    }

    return Second(res, ["Success", { data: Trak }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateTrake = async (req, res, next) => {
  try {
    const { id } = req.params;

    let updateFields = req.body;
    if (req.file && req.file.path) {
      updateFields.track_image = req.file.path;
    }

    const updatedTrak = await TrackModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedTrak) {
      return First(res, "Trak Not Found", 404, http.FAIL);
    }

    if (req.file && req.file.path) {
      return Second(
        res,
        ["Updated Trak with new image", { data: updatedTrak }],
        200,
        http.SUCCESS
      );
    } else {
      return Second(
        res,
        ["Updated Trak without changing the image", { data: updatedTrak }],
        200,
        http.SUCCESS
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteTrake = async (req, res, next) => {
  const { id } = req.params;
  try {
    let Trake = await TrackModel.findById(id);
    if (!Trake) {
      return First(res, "Trake Not Found", 404, http.FAIL);
    }
    if (Trake.track_image) {
      if (fs.existsSync(Trake.track_image)) {
        await fs.promises.unlink(Trake.track_image);
        console.log("Old Image Deleted Successfully");
      }
    }
    await TrackModel.findByIdAndDelete(id);

    return Second(res, ["deleted Trake", { data: Trake }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createTrakes,
  getAllTraks,
  getSpecificTrake,
  updateTrake,
  deleteTrake,
};
