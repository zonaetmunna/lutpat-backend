const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentProcess = async (req, res) => {
  const paymentInfo = req.body;
  const amount = paymentInfo.total * 100;
  console.log(paymentInfo);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
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
