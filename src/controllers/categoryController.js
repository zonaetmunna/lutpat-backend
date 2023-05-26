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
    let queries = { ...req.query };

    const excludeFields = ["search", "sort", "page", "limit"];
    excludeFields.forEach((field) => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    queries = JSON.parse(queryString);

    const filters = {
      limit: 10,
    };

    if (req.query.search) {
      const searchText = req.query.search;
      queries.name = { $regex: searchText, $options: "i" };
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      filters.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      filters.fields = fields;
    }

    if (req.query.page) {
      const { page, limit } = req.query;
      const skip = (page - 1) * parseInt(limit);
      filters.skip = skip;
      filters.limit = parseInt(limit);
    }

    const categoriesQuery = Category.find(queries)
      .skip(filters.skip)
      .limit(filters.limit)
      .select(filters.fields)
      .sort(filters.sortBy);

    if (req.query.populateCategory) {
      categoriesQuery.populate("category");
    }

    const categories = await categoriesQuery.exec();
    return res.json(responseGenerate(categories));
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
