const express = require("express");
const { getUnits, createUnit } = require("../controllers/unitController");
const router = express.Router();

router.get("/", getUnits);
router.post("/", createUnit);

module.exports = router;
