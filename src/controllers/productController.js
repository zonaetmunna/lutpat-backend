// external imports

// internal imports
const Product = require("../models/Product");
const responseGenerate = require("../utils/responseGenerate");
const cloudinary = require("../lib/cloudinary");

// create products
const createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    let images = [];

    // Handle single image upload
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      body.image = upload.public_id;
    }

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path);
        images.push(upload.public_id);
      }
    }

    // Add the images array to the body object
    body.images = images;

    const product = new Product(body);
    await product.save();

    return res
      .status(201)
      .json(responseGenerate(product, "Product added successfully!", false));
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    const updates = req.body; // Get the updates from the request body
    console.log(id);
    console.log(updates);
    // Find the product by ID and update it
    const product = await Product.findByIdAndUpdate(id, updates);

    // Check if the product exists
    if (!product) {
      return res
        .status(404)
        .json(responseGenerate(null, "No product found with this ID!", true));
    }

    return res.json(responseGenerate(product));
  } catch (error) {
    next(error);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    // catch id from server
    const { id } = req.params;
    // find from database with id
    const product = await Product.deleteOne({ _id: id });
    // check condition
    if (product.deletedCount) {
      return res
        .status(200)
        .json(responseGenerate(null, "Product Deleted successfully!", false));
    }

    return res
      .status(404)
      .json(responseGenerate(null, "No Product found with this Id!", true));
  } catch (error) {
    next(error);
  }
};

// get all products
const getProducts = async (req, res, next) => {
  try {
    let queries = { ...req.query };

    // Sort, page, limit -> exclude
    const excludeFields = ["search", "category", "sort", "page", "limit"];
    excludeFields.forEach((field) => delete queries[field]);
    console.log(excludeFields);

    // gt, lt, gte, lte
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
      console.log(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      filters.fields = fields;
      console.log(fields);
    }

    if (req.query.page) {
      const { page, limit } = req.query;
      const skip = (page - 1) * parseInt(limit);
      filters.skip = skip;
      filters.limit = parseInt(limit);
    }

    if (req.query.category) {
      const categoryName = req.query.category; // Get category name from query
      queries.category = categoryName;
    }

    const productsQuery = Product.find(queries)
      .skip(filters.skip)
      .limit(filters.limit)
      .select(filters.fields)
      .sort(filters.sortBy)
      .populate("category");

    // Check if 'category' field needs to be populated
    if (req.query.populateCategory) {
      productsQuery.populate("category");
    }

    const products = await productsQuery.exec();

    // const products = await productsQuery.exec();

    return res.json(responseGenerate(products));
  } catch (err) {
    next(err);
  }
};

// single product get
const getProductById = async (req, res, next) => {
  try {
    // find id from server
    const { id } = req.params;
    // server id use find database id
    const product = await Product.findOne({ _id: id });
    // check condition
    if (!product) throw new Error("No product found with this id!");
    return res.json(responseGenerate(product));
  } catch (err) {
    next(err);
  }
};

const getAllProductByShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    console.log(shopId);
    const products = await Product.find({ store: shopId }).populate("category");
    return res.json(responseGenerate(products));
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getAllProductByShop,
};
