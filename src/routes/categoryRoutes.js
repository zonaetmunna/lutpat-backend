// external imports
const router = require("express").Router();
const passport = require("passport");
const accessControl = require("../accessControl");
const {
  createCategory,
  deleteCategory,
  getCategorys,
  getCategoryById,
} = require("../controllers/categoryController");

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("createOwn", "category"),
  createCategory
);
router.get("/", getCategorys);
router.get("/:id", getCategoryById);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("deleteOwn", "category"),
  deleteCategory
);

module.exports = router;
