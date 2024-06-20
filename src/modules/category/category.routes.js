const express = require("express");
const router = express.Router();
const { HME, myMulter, pathName } = require("../../utils/fileUpload.js");
const {
  createCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  recommendedCategory,
  recommendedItemsHandler,
} = require("./category.controller.js");

// Create categories
router.post(
  "/create",
  myMulter(pathName.CreateCategory).single("image"),
  HME,
  createCategory
);

// Get all categories
router.get("/AllCategories", getAllCategories);

// Get specific category by ID
router.get("/:id", getSpecificCategory);

// Update category by ID
router.put(
  "/:id",
  myMulter(pathName.CreateCategory).single("image"),
  HME,
  updateCategory
);

// Delete category by ID
router.delete("/:id", deleteCategory);

// Get recommended Category
router.put("/recommended/:categoryId", recommendedCategory);

// Get recommendedItems
router.get("/", recommendedItemsHandler);

module.exports = router;
