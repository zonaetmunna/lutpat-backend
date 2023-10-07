// external imports
const passport = require("passport");
const router = require("express").Router();
// internal imports
const {
  signup,
  login,
  authUser,
  getAllUsers,
  getAllSeller,
  updateSeller,
  deleteSeller,
  sellerRegistration,
} = require("../controllers/authController");
const errorHandler = require("../middleware/errorHandler");
const accessControl = require("../accessControl");

// api routes
router.post("/signup", signup, errorHandler);
router.post("/login", login, errorHandler);
router.post("/seller",sellerRegistration)
router.get(
  "/auth-user",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("readOwn", "profile"),
  authUser
);
router.get("/users", getAllUsers);
router.get("/sellers", getAllSeller);
router.put("/seller/:id", updateSeller);
router.delete("/seller/:id", deleteSeller);
// router exports
module.exports = router;
