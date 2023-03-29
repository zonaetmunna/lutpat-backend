const router = require("express").Router();
const accessControl = require("../accessControl");
const passport = require("passport");
const uploader = require("../lib/multer");
const {
  createStore,
  deleteStore,
  getStoreById,
  getStores,
} = require("../controllers/storeController");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("createOwn", "store"),
  uploader.single("image"),
  createStore
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  accessControl.grantAccess("deleteOwn", "store"),
  deleteStore
);

router.get("/:id", getStoreById);

router.get("/", getStores);

module.exports = router;
