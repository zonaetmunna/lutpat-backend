// external imports

// internal imports
const User = require("../models/User");
const responseGenerate = require("../utils/responseGenerate");
const jwt = require("../lib/jwt");

// signup
const signup = async (req, res, next) => {
  try {
    const body = req.body;
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
      profileImage: req.body.profileImage, // Assuming you are using multer or similar middleware for file uploads
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

const getAllSeller = async (req, res, next) => {
  try {
    let queries = { ...req.query };

    const excludeFields = ["search", "sort", "page", "limit"];
    excludeFields.forEach((field) => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    queries = JSON.parse(queryString);

    const filters = {
      limit: 10,
    };

    if (req.query.search) {
      const searchText = req.query.search;
      queries.name = { $regex: searchText, $options: "i" };
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      filters.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      filters.fields = fields;
    }

    if (req.query.page) {
      const { page, limit } = req.query;
      const skip = (page - 1) * parseInt(limit);
      filters.skip = skip;
      filters.limit = parseInt(limit);
    }

    const sellerQuery = User.find({ ...queries, role: "seller" })
      .skip(filters.skip)
      .limit(filters.limit)
      .select(filters.fields)
      .sort(filters.sortBy);

    const sellers = await sellerQuery.exec();

    return res.json(
      responseGenerate(sellers, "Sellers retrieved successfully!", false)
    );
  } catch (err) {
    next(err);
  }
};

const updateSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const updates = { ...req.body };

    const updatedSeller = await User.findByIdAndUpdate(sellerId, updates, {
      new: true,
    });

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.json({
      success: true,
      message: "Seller updated successfully",
      data: updatedSeller,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const deletedSeller = await User.findByIdAndDelete(sellerId);

    if (!deletedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.json({
      success: true,
      message: "Seller deleted successfully",
      data: deletedSeller,
    });
  } catch (err) {
    next(err);
  }
};

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
  getAllSeller,
  updateSeller,
  deleteSeller,
  sellerLogin,
  sellerRegistration,
};
