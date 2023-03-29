const router = require("express").Router();
const accessControl = require("../accessControl");
const passport = require("passport");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get(
  "/stats",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("createOwn", "category"),
  getDashboardStats
);

module.exports = router;
