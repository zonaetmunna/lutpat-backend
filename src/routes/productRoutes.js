// external imports
const router = require('express').Router();
const passport = require('passport');
// internal imports
const { createProduct, deleteProduct, getProductById, getProducts } = require('../controllers/productController');
const accessControl = require('../accessControl');
const uploader = require('../lib/multer');



// api
// post
router.post('/',
  passport.authenticate('jwt', { session: false }),
	accessControl.grantAccess('createOwn', 'product'),
  uploader.single('image'),
  createProduct
);
// delete
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.grantAccess('deleteOwn', 'product'), 
  deleteProduct
);
// get
router.get('/', getProducts);
// get
router.get('/:id', getProductById);



// exports
module.exports = router;