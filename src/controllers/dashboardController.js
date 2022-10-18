const Order = require("../models/Order");
const Product = require("../models/Product");
const Store = require("../models/Store");
const User = require("../models/User");
const responseGenerate = require("../utils/responseGenerate");




module.exports.getDashboardStats = async (req, res, next) => {
	try{
		const totalUser = await User.countDocuments();
		const totalOrder = await Order.countDocuments();
		const totalProduct = await Product.countDocuments();
		const totalStore = await Store.countDocuments();

		return res.status(200).json(responseGenerate({totalUser, totalOrder, totalProduct, totalStore }, null, true));
		
	} catch(err) {
		next(err);
	}
};
