const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentProcess = async (req, res) => {
  const paymentInfo = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: paymentInfo.total * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.json({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = {
  paymentProcess,
};
