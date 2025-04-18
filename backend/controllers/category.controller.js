const Category = require("../models/category.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    ApiResponse.success(res, "Categories retrieved successfully", categories);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving categories", error));
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorHandler(404, "Category not found"));
    }
    ApiResponse.success(res, "Category retrieved successfully", category);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving category", error));
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, parentId } = req.body;
    const newCategory = await Category.create({
      name,
      slug,
      description,
      parentId,
    });
    ApiResponse.created(res, "Category created successfully", newCategory);
  } catch (error) {
    next(new ErrorHandler(500, "Error creating category", error));
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, slug, description, parentId } = req.body;
    const updatedCategory = await Category.update(req.params.id, {
      name,
      slug,
      description,
      parentId,
    });

    if (!updatedCategory) {
      return next(new ErrorHandler(404, "Category not found"));
    }

    ApiResponse.success(res, "Category updated successfully", updatedCategory);
  } catch (error) {
    next(new ErrorHandler(500, "Error updating category", error));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) {
      return next(new ErrorHandler(404, "Category not found"));
    }
    ApiResponse.success(res, "Category deleted successfully");
  } catch (error) {
    if (error.message.includes("Cannot delete category")) {
      return next(new ErrorHandler(400, error.message));
    }
    next(new ErrorHandler(500, "Error deleting category", error));
  }
};
