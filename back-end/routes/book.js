const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/upload');
const validateBook = require('../middleware/validate-book');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, upload, validateBook, resizeImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put(
	'/:id',
	auth,
	upload,
	validateBook,
	resizeImage,
	bookCtrl.updateBook
);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
