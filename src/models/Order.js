const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    products: [OrderProductSchema],
    billingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      country: String,
      city: String,
      zip: Number,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "delivered", "rejected"],
    },
    totalAmount: Number,
    paymentInfo: {
      method: {
        type: String,
        enum: ["stripe", "bkash"],
        // required: true,
      },
      stripePayment: {
        paymentIntentId: String,
        status: String,
      },
      bkashPayment: {
        transactionId: String,
        status: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
