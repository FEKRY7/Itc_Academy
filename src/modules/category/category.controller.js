const CategoryModel = require("../../../Database/models/category.model.js");
const ServiceModel = require("../../../Database/models/services.model.js");
const fs = require("fs");
const { pathName } = require("../../utils/fileUpload.js");
const path = require("path");
const { Error } = require("mongoose");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// Create categories
const createCategory = async (req, res) => {
  try {
    if (req.file && req.file.path) {
      const image = req.file;
      const newImageUrl = image ? image.path : "";
      const newImageId = image ? image.filename : "";
      req.body.image = newImageUrl;
      req.body.imageId = newImageId;

      const category = await CategoryModel.create(req.body);

      return Second(
        res,
        ["category has been created", category],
        200,
        http.SUCCESS
      );
    } else {
      return First(res, "image is required", 400, http.FAIL);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const Categories = await CategoryModel.find({});
    return Second(
      res,
      ["All Categories", { data: Categories }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get specific category by ID
const getSpecificCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Category = await CategoryModel.findById(id);
    if (!Category) {
      return First(res, "Category not found", 404, http.FAIL);
    }
    return Second(res, ["Success", { data: Category }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Update category by ID
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldCategory = await CategoryModel.findById(id);

    if (req.file) {
      const image = req.file;
      req.body.image = image.path;
      req.body.imageId = image.filename;

      if (oldCategory && oldCategory.imageId) {
        // Check if the old image file exists before trying to delete
        console.log("Old Image Path:", oldCategory.image);
        if (fs.existsSync(oldCategory.image)) {
          await fs.promises.unlink(oldCategory.image);
          console.log("Old Image Deleted Successfully");
        } else {
          console.log("Old Image File Not Found");
        }
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { ...req.body } },
      { new: true }
    );

    if (!updatedCategory) {
      return First(res, "Category Not Found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Updated Category", { data: updatedCategory }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Delete category by ID
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await CategoryModel.findById(id);
    if (!category) {
      return First(res, "Category Not Found", 404, http.FAIL);
    }
    if (category.image) {
      if (fs.existsSync(category.image)) {
        await fs.promises.unlink(category.image);
        console.log("Old Image Deleted Successfully");
      }
    }
    await CategoryModel.findByIdAndDelete(id);

    return Second(
      res,
      ["Category Deleted", { data: category }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get recommended Category
const recommendedCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { recommended } = req.body;
    if (recommended) {
      const recommendedCategoriesCount = await CategoryModel.countDocuments({
        recommended: true,
      });

      if (recommendedCategoriesCount >= 4) {
        return First(
          res,
          "Only four recommended categories are allowed",
          400,
          http.FAIL
        );
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { recommended: true },
      { new: true }
    );

    if (!updatedCategory) {
      return First(res, "Category not found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Recommended status updated successfully", { data: updatedCategory }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get recommendedItems
const recommendedItemsHandler = async (req, res) => {
  try {
    const recommendedCategories = await CategoryModel.find({
      recommended: true,
    });

    const recommendedServices = await ServiceModel.find({ recommended: true });
    const recommendedItems = [
      ...recommendedCategories.map((category) => ({
        type: "category",
        data: category,
      })),
      ...recommendedServices.map((service) => ({
        type: "service",
        data: service,
      })),
    ];

    return Second(
      res,
      ["Recommended items retrieved successfully", { data: recommendedItems }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  recommendedCategory,
  recommendedItemsHandler,
};
