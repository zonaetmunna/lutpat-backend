const mongoose = require("mongoose");
const { Schema } = mongoose;

const StoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "blocked"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Store", StoreSchema);
