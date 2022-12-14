// external imports

// internal imports
const Product = require("../models/Product");
const responseGenerate = require("../utils/responseGenerate");



// create products
const createProduct = async (req, res, next) => {
  try {

    const body = req.body;

    // call model
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
    };

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
    // find product from server req
    const query = req.query;
    // find product with server req from database
    const products = await Product.find(query);

    return res.json(responseGenerate(products));

  } catch (err) {
    next(err);
  }
};

// single proudct get
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




// exports
module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
};