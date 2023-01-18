// external imports
const router = require('express').Router();


router.use('/auth', require('./authRoutes'));
router.use('/product', require('./productRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/order', require('./orderRoutes'));
router.use('/store', require('./storeRoutes'));
router.use('/marchent', require('./marchentRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

// router module exports
module.exports = router;