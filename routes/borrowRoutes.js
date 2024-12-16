const express = require('express');
const router = express.Router();
const borrowController = require('../controller/borrowController');
// Request to borrow a book
router.post('/request', borrowController.requestToBorrowBook);

// Get all borrow requests (admin view)
router.get('/allrequest', borrowController.getAllBorrowRequests);

// Admin approve borrow request
router.put('/approve/:requestId', borrowController.approveBorrowRequest);

// Admin reject borrow request
router.put('/reject/:requestId', borrowController.rejectBorrowRequest);

// Get borrow requests for a specific user
router.get('/allrequest/:userId', borrowController.getUserBorrowRequests);

// Get borrow requests for a specific Librarian
router.get('/librarian/:LibrarianId', borrowController.getLibrarianBorrowRequests);

module.exports = router;