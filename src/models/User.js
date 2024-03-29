// external imports
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [false, "Please provide a first name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    email: {
      type: String,
      unique: "Email Address is Already Registered!",
      required: [true, "Email is required!"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password should be greater than or equal 6 character!"],
    },
    phone: {
      type: String,
      required: [true, "phone is required!"],
      unique: true,
      validate: {
        validator: (value) => {
          return validator.isMobilePhone(value);
        },
        message: "Please provide a valid phone number",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "merchant", "user", "seller"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "blocked"],
    },
    profileImage: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },
  },
  { timestamp: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// mongoose uniqe validation
UserSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = mongoose.model("User", UserSchema);
