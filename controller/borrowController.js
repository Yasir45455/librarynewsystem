const borrowService = require('../services/borrowService');
const requestToBorrowBook = async (req, res) => {
  try {
    const { LibrarianId, userId, bookId } = req.body;

    await borrowService.findRequestOnce(userId, bookId); 
    
    const request = await borrowService.requestToBorrowBook(LibrarianId, userId, bookId);

    res.status(201).json({ message: 'Borrow request created successfully', request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Approve a borrow request
const approveBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await borrowService.approveBorrowRequest(requestId);
    res.status(200).json({ message: 'Request approved successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reject a borrow request
const rejectBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await borrowService.rejectBorrowRequest(requestId);
    res.status(200).json({ message: 'Request rejected successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all borrow requests
const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await borrowService.getAllBorrowRequests();
    res.status(200).json({ message: 'All borrow requests fetched successfully', requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Other functions remain the same
const getUserBorrowRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await borrowService.getUserBorrowRequests(userId);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No borrow requests found for this user.' });
    }
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getLibrarianBorrowRequests = async (req, res) => {
  try {
    const LibrarianId = req.params.LibrarianId;
    const requests = await borrowService.getLibrarianBorrowRequests(LibrarianId);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No borrow requests found for this user.' });
    }
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  requestToBorrowBook,
  approveBorrowRequest,
  rejectBorrowRequest,
  getUserBorrowRequests,
  getAllBorrowRequests, // Add this line to export the new function
  getLibrarianBorrowRequests,
};
