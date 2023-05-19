// external imports

// internal imports
const User = require("../models/User");
const responseGenerate = require("../utils/responseGenerate");
const jwt = require("../lib/jwt");

// signup
const signup = async (req, res, next) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    };
    const user = new User(body);
    console.log(user);
    await user.save();
    return res.json(responseGenerate(user, "Registration successful!", false));
  } catch (err) {
    next(err);
  }
};

//login
const login = async (req, res, next) => {
  try {
    // get user with finding
    const user = await User.findOne({ email: req.body.email });

    // check user
    if (!user) {
      throw new Error("No user with this email!");
    }

    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      throw new Error("Incorrect email or password!");
    }

    const token = jwt.issueJWT(user);
    return res.json(
      responseGenerate(
        {
          name: user.name,
          email: user.email,
          _id: user._id,
          profileImage: user.profileImage,
          phone: user.phone,
          role: user.role,
          status: user.status,
          token,
        },
        "Login successful!",
        false
      )
    );
  } catch (err) {
    next(err);
  }
};

// auth user
const authUser = async (req, res, next) => {
  try {
    return res.json(responseGenerate(req.user));
  } catch (err) {
    next(err);
  }
};

// Seller registration
const sellerRegistration = async (req, res, next) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: "seller", // Set the role as "seller"
      status: "pending", // Set the status as "pending" or modify as needed
      profileImage: req.file.filename, // Assuming you are using multer or similar middleware for file uploads
    };

    const user = new User(body);
    await user.save();

    // Issue JWT token
    const token = jwt.issueJWT(user);

    return res.json(
      responseGenerate(
        {
          name: user.name,
          email: user.email,
          _id: user._id,
          profileImage: user.profileImage,
          phone: user.phone,
          role: user.role,
          status: user.status,
          token,
        },
        "Seller registration successful!",
        false
      )
    );
  } catch (err) {
    next(err);
  }
};

// for admin
const getAllUsers = async (req, res, next) => {
  try {
    const query = req.query;
    const users = await User.find(query);
    return res.json(
      responseGenerate(users, "Users retrieved successfully!", false)
    );
  } catch (err) {
    next(err);
  }
};

// Seller login
const sellerLogin = async (req, res, next) => {
  try {
    // Find user with the given email and role as "seller"
    const user = await User.findOne({ email: req.body.email, role: "seller" });

    // Check if user exists
    if (!user) {
      throw new Error("No seller found with this email!");
    }

    // Verify the password
    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      throw new Error("Incorrect email or password!");
    }

    // Issue JWT token
    const token = jwt.issueJWT(user);

    return res.json(
      responseGenerate(
        {
          name: user.name,
          email: user.email,
          _id: user._id,
          profileImage: user.profileImage,
          phone: user.phone,
          role: user.role,
          status: user.status,
          token,
        },
        "Seller login successful!",
        false
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  authUser,
  getAllUsers,
  sellerLogin,
  sellerRegistration,
};
