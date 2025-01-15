const express = require('express');
const libraryController = require('../controller/libraryController');
const authenticateAdmin = require('../middelwares/authMiddleware');

const router = express.Router();

// CRUD Endpoints
router.post('/add', libraryController.addLibrary);
router.get('/', libraryController.getAllLibraries);
router.get('/librarian/:userId', libraryController.getLibraryByUserId);
router.get('/:id', libraryController.getLibraryById);
router.put('/:id',authenticateAdmin, libraryController.updateLibraryById);
router.delete('/:id',authenticateAdmin, libraryController.deleteLibraryById);

module.exports = router;