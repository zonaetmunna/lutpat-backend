// external imports
const passport = require('passport');
const router = require('express').Router();
// internal imports
const { signup, login, authUser } = require('../controllers/authController');
const errorHandler = require('../middleware/errorHandler');
const accessControl = require('../accessControl');



// api routes
router.post('/signup', signup,errorHandler);
router.post('/login', login, errorHandler);
router.get('/auth-user',
  passport.authenticate('jwt', { session: false }),
  accessControl.grantAccess('readOwn', 'profile'),
  authUser
);

// router exports
module.exports = router;