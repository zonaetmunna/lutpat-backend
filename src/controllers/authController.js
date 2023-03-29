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
    await user.save();
    return res.json(responseGenerate(user, "Registration successful!", false));
  } catch (err) {
    next(err);
  }
};

//login
const login = async (req, res, next) => {
  try {
    // get user with findone
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
          id: user._id,
          profileImage: user.profileImage,
          phone: user.profileImage,
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

module.exports = {
  signup,
  login,
  authUser,
};
