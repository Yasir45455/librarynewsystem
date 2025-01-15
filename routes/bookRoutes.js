const express = require('express');
const bookController = require('../controller/bookController');
const router = express.Router();
const multer = require('multer');
const authenticateAdmin = require('../middelwares/authMiddleware');
const authenticateUser = require('../middelwares/authUserMiddleware');
const authenticateAdminOrUser = require('../middelwares/authenticateAdminUser');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/',authenticateAdminOrUser, upload.single('image'), bookController.createBook);

// GET: Retrieve all books
router.get('/', bookController.getAllBooks);

// GET: Get books for a specific user
router.get('/user/:userId', bookController.getBooksByUserId);

router.get('/booksbycategory/:category', bookController.getBooksByCategory);

router.get('/admin/:adminId',authenticateAdmin, bookController.getBooksByAdminId);

// GET: Retrieve a book by id
router.get('/:id', bookController.getBookById);

// PUT: Update a book by id
router.put('/:id',authenticateAdminOrUser, bookController.updateBook);

// DELETE: Delete a book by id
router.delete('/:id',authenticateAdminOrUser, bookController.deleteBook);

module.exports = router;