const CategoryModel = require("../../../Database/models/category.model.js");
const ServiceModel = require("../../../Database/models/services.model.js");
const fs = require("fs");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

// Create a service
const createService = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryFound = await CategoryModel.findById(categoryId);
    if (!categoryFound) {
      return First(res, "Category Not Found", 404, http.FAIL);
    }
    if (req.file && req.file.path) {
      const image = req.file;
      req.body.image = image.filename;
      req.body.imageUrl = image.path;
      req.body.categoryId = categoryId;
      const service = new ServiceModel(req.body);
      await service.save();

      return Second(res, ["Success", { data: service }], 200, http.SUCCESS);
    } else {
      return First(res, "image not provided", 400, http.FAIL);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Get all services
const getAllServices = async (req, res) => {
  try {
    if (req.params.categoryId) {
      const categoryFound = await CategoryModel.findById(req.params.categoryId);
      if (!categoryFound) {
        return First(res, "Category Not Found", 404, http.FAIL);
      }
      const services = await ServiceModel.find({
        categoryId: req.params.categoryId,
      });

      return Second(
        res,
        [
          `This is All Services in category:${categoryFound.name}`,
          { data: services },
        ],
        200,
        http.SUCCESS
      );
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const oldService = await ServiceModel.findById(id);

    if (req.file) {
      const image = req.file;
      req.body.image = image.filename;
      req.body.imageUrl = image.path;

      if (oldService) {
        console.log(oldService.imageUrl);
        if (fs.existsSync(oldService.imageUrl)) {
          await fs.promises.unlink(oldService.imageUrl);
          console.log("Old Image Deleted Successfully");
        } else {
          console.log("Old Image File Not Found");
        }
      }
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedService) {
      return First(res, "Service Not Found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Updated Service", { data: updatedService }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Get a specific service
const getSpecificService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findById(id);
    if (!service) {
      return First(res, "Service Not Found", 404, http.FAIL);
    }

    return Second(res, ["Success", { data: service }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// // Delete a service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findById(id);
    if (!service) {
      return First(res, "Service Not Found", 404, http.FAIL);
    }
    if (service.imageUrl) {
      if (fs.existsSync(service.imageUrl)) {
        await fs.promises.unlink(service.imageUrl);
        console.log("Old Image Deleted Successfully");
      } else {
        console.log("Old Image File Not Found");
      }
    }
    await ServiceModel.findByIdAndDelete(id);

    return Second(
      res,
      ["Service Deleted", { data: service }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const setRecommendedStatusForService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { recommended } = req.body;
    if (recommended) {
      const recommendedServicesCount = await ServiceModel.countDocuments({
        recommended: true,
      });

      if (recommendedServicesCount >= 6) {
        return First(
          res,
          "Only six recommended services are allowed",
          400,
          http.FAIL
        );
      }
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      { recommended: true },
      { new: true }
    );

    if (!updatedService) {
      return First(res, "Service not found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Recommended status updated successfully", { data: updatedService }],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  getSpecificService,
  deleteService,
  setRecommendedStatusForService,
};
