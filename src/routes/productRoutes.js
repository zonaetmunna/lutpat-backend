// external imports
const router = require("express").Router();
const passport = require("passport");
// internal imports
const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getAllProductByShop,
  updateProduct,
} = require("../controllers/productController");
const accessControl = require("../accessControl");
const uploader = require("../lib/multer");

// api routes
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("createOwn", "product"),
  uploader.array("image", 4),
  createProduct
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("updateOwn", "product"),
  updateProduct
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("deleteOwn", "product"),
  deleteProduct
);
router.get("/get-shop-product/:id", getAllProductByShop);
router.get("/", getProducts);
router.get("/:id", getProductById);

// router exports
module.exports = router;
