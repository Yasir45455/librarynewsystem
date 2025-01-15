const express = require('express');
const authorController = require('../controller/authorController');
const router = express.Router();
const authenticateAdmin = require('../middelwares/authMiddleware');

// POST: Create a new author
router.post('/',authenticateAdmin, authorController.createAuthor);
// GET: Get all authors
router.get('/', authorController.getAllAuthors);
router.get('/user/:userId', authorController.getAuthorsByUserId); 
// GET: Get author by name
router.get('/:name', authorController.getAuthorByName);
// PUT: Update an author by ID
router.put('/:id',authenticateAdmin, authorController.updateAuthor);
// DELETE: Delete an author by ID
router.delete('/:id',authenticateAdmin, authorController.deleteAuthor);
module.exports = router;
