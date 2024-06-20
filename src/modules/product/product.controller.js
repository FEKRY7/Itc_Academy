const { nanoid } = require("nanoid");
const brandModel = require("../../../Database/models/brand.model.js");
const categoryModel = require("../../../Database/models/category.model.js");
const subCategoryModel = require("../../../Database/models/subCategory.model.js");
const productModel = require("../../../Database/models/product.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const createProduct = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.body.Category);
    if (!category) {
      return First(res, "This Category is not found", 404, http.FAIL);
    }

    const subCategory = await subCategoryModel.findById(req.body.subCategory);
    if (!subCategory) {
      return First(res, "This Subcategory is not found", 404, http.FAIL);
    }

    const brand = await brandModel.findById(req.body.brand);
    if (!brand) {
      return First(res, "This brand doesn't exist", 404, http.FAIL);
    }

    if (!req.files || !req.files.images || !Array.isArray(req.files.images)) {
      return First(res, "Product images are required", 400, http.FAIL);
    }

    const cloudFolder = req.body.name + "__" + nanoid();
    let images = [];

    for (const file of req.files.images) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}` }
      );
      images.push({ url: secure_url, id: public_id });
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.defaultImage[0].path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}` }
    );

    const product = await productModel.create({
      ...req.body,
      slug: slugify(req.body.name),
      cloudFolder,
      createdBy: req.user._id,
      defaultImage: { url: secure_url, id: public_id },
      images,
    });

    return Second(res, "Product created", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return First(res, "Product not found", 404, http.FAIL);
    }

    if (product.createdBy.toString() != req.user._id.toString()) {
      return First(res, "not authorized user ", 401, http.FAIL);
    }

    await product.deleteOne();

    const ids = product.images.map((imag) => imag.id);
    ids.push(product.defaultImage.id);
    console.log(ids);
    await cloudinary.api.delete_resources(ids);
    await cloudinary.api.delete_folder(
      `${process.env.CLOUD_FOLDER_NAME}/product/${product.cloudFolder}`
    );

    return Second(res, "Product deleted", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { sort, page, keyword, category, brand, subcategory } = req.query;

    if (brand && !(await brandModel.findById())) {
      return First(res, "Brand not Found", 404, http.FAIL);
    }

    if (category && !(await categoryModel.findById())) {
      return First(res, "Category not Found", 404, http.FAIL);
    }

    if (subcategory && !(await subCategoryModel.findById())) {
      return First(res, "subCategory not Found", 404, http.FAIL);
    }

    const results = await productModel
      .find({ ...req.query })
      .sort(sort)
      .paginate(page)
      .search(keyword);

    return Second(res, results, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getAllProducts,
};
