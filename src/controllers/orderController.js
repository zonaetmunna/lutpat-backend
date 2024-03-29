const Order = require("../models/Order");
const responseGenerate = require("../utils/responseGenerate");

// get / create order
const createOrder = async (req, res, next) => {
  try {
    const body = { ...req.body };

    const paymentOrder = {
      userId: body.userId,
      products: body.products,
      billingAddress: body.billingAddress,
      totalAmount: body.totalAmount,
      paymentInfo: body.paymentInfo,
    };

    const order = new Order(paymentOrder);
    await order.save();
    return res
      .status(201)
      .json(responseGenerate(order, "Order placed successfully!", false));
  } catch (error) {
    next(error);
  }
};

// delete / delete order
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.deleteOne({ _id: id });
    if (order.deletedCount) {
      return res
        .status(200)
        .json(responseGenerate(null, "Order Deleted successfully!", false));
    }

    return res
      .status(404)
      .json(responseGenerate(null, "No Order found with this Id!", true));
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });
    if (!order) throw new Error("No order found with this id!");
    return res.json(responseGenerate(order));
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const query = req.query;
    const orders = await Order.find(query).populate({
      path: "products",
      populate: {
        path: "store",
      },
    });
    return res.json(responseGenerate(orders));
  } catch (error) {
    next(error);
  }
};

const getOrderWithUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const orders = await Order.find({ userId }).populate({
      path: "products",
      populate: {
        path: "store",
      },
    });

    return res.json(responseGenerate(orders));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrder,
  getOrderWithUser,
};
