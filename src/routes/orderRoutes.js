const router = require("express").Router();
const passport = require("passport");
const accessControl = require("../accessControl");
const {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrder,
  getOrderWithUser,
} = require("../controllers/orderController");

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("createOwn", "order"),
  createOrder
);

router.delete(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  // accessControl.grantAccess("deleteOwn", "order"),
  deleteOrder
);

router.get("/:id", getOrderById);

router.get("/", getOrder);
router.get("/user/:userId", getOrderWithUser);

module.exports = router;
