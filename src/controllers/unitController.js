const Unit = require("../models/Unit");
const responseGenerate = require("../utils/responseGenerate");

exports.getUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({});
    return res
      .status(200)
      .json(responseGenerate(units, "Unit gated successfully!", false));
  } catch (error) {
    next(error);
  }
};

exports.createUnit = async (req, res, next) => {
  try {
    const body = req.body;
    const unit = await Unit.create(body);
    return res
      .status(200)
      .json(responseGenerate(unit, "Unit added successfully!", false));
  } catch (error) {
    next(error);
  }
};
