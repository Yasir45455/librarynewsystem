const express = require('express');
const bookController = require('../controller/bookController');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads');
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });
  
  router.post('/', upload.single('image'), bookController.createBook);

// GET: Retrieve all books
router.get('/', bookController.getAllBooks);

// GET: Get books for a specific user
router.get('/user/:userId', bookController.getBooksByUserId);

router.get('/booksbycategory/:category', bookController.getBooksByCategory);

router.get('/admin/:adminId', bookController.getBooksByAdminId); 

// GET: Retrieve a book by id
router.get('/:id', bookController.getBookById);

// PUT: Update a book by id
router.put('/:id', bookController.updateBook);

// DELETE: Delete a book by id
router.delete('/:id', bookController.deleteBook);

module.exports = router;
