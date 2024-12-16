const express = require('express');
const libraryController = require('../controller/libraryController');

const router = express.Router();

// CRUD Endpoints
router.post('/add', libraryController.addLibrary);
router.get('/', libraryController.getAllLibraries);
router.get('/librarian/:userId', libraryController.getLibraryByUserId);
router.get('/:id', libraryController.getLibraryById);
router.put('/:id', libraryController.updateLibraryById);
router.delete('/:id', libraryController.deleteLibraryById);

module.exports = router;