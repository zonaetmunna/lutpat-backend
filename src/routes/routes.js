const { paymentProcess } = require("../controllers/paymentController");

// external imports
const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/category", require("./categoryRoutes"));
router.use("/order", require("./orderRoutes"));
router.use("/store", require("./storeRoutes"));
router.use("/marchent", require("./marchentRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/create-payment-intent", paymentProcess);

// router module exports
module.exports = router;
