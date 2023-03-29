// external imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// schema
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
  },
  { timestamp: true }
);

// exports schema model
module.exports = mongoose.model("Category", CategorySchema);
