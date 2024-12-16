const express = require('express');
const authorController = require('../controller/authorController');
const router = express.Router();

// POST: Create a new author
router.post('/', authorController.createAuthor);
// GET: Get all authors
router.get('/', authorController.getAllAuthors);
router.get('/user/:userId', authorController.getAuthorsByUserId); // Get categories for a specific user
// GET: Get author by name
router.get('/:name', authorController.getAuthorByName);
// PUT: Update an author by ID
router.put('/:id', authorController.updateAuthor);
// DELETE: Delete an author by ID
router.delete('/:id', authorController.deleteAuthor);
module.exports = router;
