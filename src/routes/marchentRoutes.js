// import external
const router = require('express').Router();
const passport = require('passport');
// import internal
const accessControl = require('../accessControl');
const { getStats, getProducts } = require('../controllers/marchentController');

// routes
router.get('/products',
	passport.authenticate('jwt', { session: false }),
	accessControl.grantAccess('createOwn', 'product'),
	getProducts
);

router.get(
	'/stats',
	passport.authenticate('jwt', { session: false }),
	accessControl.grantAccess('createOwn', 'product'),
	getStats
);

module.exports = router;