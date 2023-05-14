// external imports

// internal imports
const Product = require("../models/Product");
const responseGenerate = require("../utils/responseGenerate");

// create products
const createProduct = async (req, res, next) => {
  try {
    // req.body
    const body = req.body;
    console.log(body);
    // call model instance
    const product = new Product(body);
    // save database
    await product.save();
    return res
      .status(201)
      .json(responseGenerate(product, "Product Added successfully!", false));
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
    const { category } = req.query;
    const query = category ? { "category.name": category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
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
  deleteProduct,
  getProducts,
  getProductById,
  getAllProductByShop,
};
