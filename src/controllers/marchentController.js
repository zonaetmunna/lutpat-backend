const Order = require('../models/Order');
const responseGenerate = require('../utils/responseGenerate');
const Store = require('../models/Store');
const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
	try{
		const query = req.query;
		const store = await Store.findOne({owner: req.user._id});
		const products = await Product.find({...query, store: store._id});
		return res.json(responseGenerate(products));
	} catch(err){
		next(err);
	}
};

const getStats = async (req, res, next) => {
	try{
		const query = req.query;
		const store = await Store.findOne({owner: req.user._id});
		const totalProduct = await Product.countDocuments({...query, store: store._id});
		const totalOrder = await Order.countDocuments();

		return res.json(responseGenerate({totalProduct, totalOrder}));
	} catch(err){
		next(err);
	}
};

module.exports = {
  getProducts,
  getStats,

}
