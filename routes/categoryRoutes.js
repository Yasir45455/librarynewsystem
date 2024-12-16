const express = require('express');
const categoryController = require('../controller/categoryController');
const router = express.Router();

// POST: Create a new category
router.post('/', categoryController.createCategory);

// GET: Get all categories
router.get('/', categoryController.getAllCategories); // Get all categories for all users

// GET: Get categories for a specific user
router.get('/user/:userId', categoryController.getCategoriesByUserId); // Get categories for a specific user

// GET: Get category by name
router.get('/:categoryName', categoryController.getCategoryByName);

// PUT: Update a category by ID
router.put('/:id', categoryController.updateCategory);

// DELETE: Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
