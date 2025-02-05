const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const validateBook = require('../middleware/validate-book');
const resizeImage = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, validateBook, multer, resizeImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put(
	'/:id',
	auth,
	validateBook,
	multer,
	resizeImage,
	bookCtrl.updateBook
);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
