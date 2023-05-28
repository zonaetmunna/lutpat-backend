const router = require("express").Router();
const accessControl = require("../accessControl");
const passport = require("passport");
const uploader = require("../lib/multer");
const {
  createStore,
  deleteStore,
  getStoreById,
  getStores,
  updateStore,
} = require("../controllers/storeController");

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("createOwn", "store"),
  // uploader.single("image"),
  createStore
);
router.get("/", getStores);
router.get("/:id", getStoreById);
router.put(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("deleteOwn", "store"),
  updateStore
);
router.delete(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("deleteOwn", "store"),
  deleteStore
);

module.exports = router;
