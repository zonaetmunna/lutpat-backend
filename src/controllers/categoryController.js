const Category = require("../models/Category");
const responseGenerate = require("../utils/responseGenerate");

// create category
const createCategory = async (req, res, next) => {
  try {
    const body = req.body;
    const category = new Category(body);
    await category.save();
    return res
      .status(201)
      .json(responseGenerate(category, "Category Added successfully!", false));
  } catch (error) {
    next(err);
  }
};

// delete category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.deleteOne({ _id: id });

    if (category.deletedCount) {
      return res
        .status(200)
        .json(responseGenerate(null, "Category Deleted successfully!", false));
    }

    return res
      .status(404)
      .json(responseGenerate(null, "No Category found with this Id!", true));
  } catch (error) {
    next(error);
  }
};

// get single category
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    if (!category) throw new Error("No category found with this id!");
    return res.json(responseGenerate(category));
  } catch (err) {
    next(err);
  }
};

// get category
const getCategorys = async (req, res, next) => {
  try {
    const query = req.query;
    const categorys = await Category.find(query);
    return res.json(responseGenerate(categorys));
  } catch (err) {
    next(err);
  }
};

// exports
module.exports = {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategorys,
};
