// external imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    anotherImage: {
      type: [String],
      required: false,
    },
    /* category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    }, */
    category: {
      type: String, // Update the type to String
      required: false,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Product", ProductSchema);
