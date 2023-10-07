const cloudinary = require("../lib/cloudinary");
const Store = require("../models/Store");
const responseGenerate = require("../utils/responseGenerate");

const createStore = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const body = { ...req.body, owner };
    console.log(body);
    const upload = await cloudinary.uploader.upload(req.file.path);

    body.image = upload.public_id;
    const store = new Store(body);
    await store.save();

    return res
      .status(201)
      .json(responseGenerate(result, "Store Added successfully!", false));
  } catch (err) {
    next(err);
  }
};

const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("update store id", id);
    const body = req.body;
    console.log(body);
    const result = await Store.findByIdAndUpdate(id, body);
    if (!result) {
      return res
        .status(404)
        .json(responseGenerate(null, "No store found with this ID!", true));
    }
    return res
      .status(200)
      .json(responseGenerate(result, "Store updated successfully!", false));
  } catch (err) {
    next(err);
  }
};

const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await Store.deleteOne({ _id: id });
    if (store.deletedCount) {
      return res
        .status(200)
        .json(responseGenerate(null, "Store Deleted successfully!", false));
    }
    return res
      .status(404)
      .json(responseGenerate(null, "No Store found with this Id!", true));
  } catch (err) {
    next(err);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await Store.findOne({ _id: id });
    if (!store) throw new Error("No store found with this id!");
    return res.json(responseGenerate(store));
  } catch (err) {
    next(err);
  }
};

const getStores = async (req, res, next) => {
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

    const categoriesQuery = Store.find(queries)
      .skip(filters.skip)
      .limit(filters.limit)
      .select(filters.fields)
      .sort(filters.sortBy);

    if (req.query.populateCategory) {
      categoriesQuery.populate("category");
    }

    const stores = await categoriesQuery.exec();
    return res.json(responseGenerate(stores));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createStore,
  deleteStore,
  getStoreById,
  getStores,
  updateStore,
};
