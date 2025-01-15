const express = require('express');
const categoryController = require('../controller/categoryController');
const router = express.Router();
const multer = require('multer');
const authenticateAdmin = require('../middelwares/authMiddleware');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads');
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });
// POST: Create a new category
router.post('/',authenticateAdmin,  upload.single('image'), categoryController.createCategory);

// GET: Get all categories
router.get('/', categoryController.getAllCategories); // Get all categories for all users

// GET: Get categories for a specific user
router.get('/user/:userId', categoryController.getCategoriesByUserId); // Get categories for a specific user

// GET: Get category by name
router.get('/:categoryName', categoryController.getCategoryByName);

// PUT: Update a category by ID
router.put('/:id',authenticateAdmin, categoryController.updateCategory);

// DELETE: Delete a category by ID
router.delete('/:id',authenticateAdmin, categoryController.deleteCategory);

module.exports = router;
