const borrowService = require('../services/borrowService');
const bookRepository = require('../repositories/bookRepository')
const AdminbookRepository = require('../repositories/AdminbookRepository')
const sendemail = require("../sendEmail/sendEmail")
const notificationRepository = require('../repositories/notificationRepository');

const requestToBorrowBook = async (req, res) => {
  try {
    const { LibrarianId, userId, bookId } = req.body;
    await borrowService.findRequestOnce(userId, bookId);
    const request = await borrowService.requestToBorrowBook(LibrarianId, userId, bookId);

    res.status(201).json({ message: 'Borrow request created successfully', request });

    // For Saving Notification
    const notificationData = {
      message: `Borrow Request Received from ${request.userId.username}`,
      userId: LibrarianId,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    await notificationRepository.createNotification(notificationData);

    // For Sending Email
    await sendemail.SendEmailBorrowRequest(userId, bookId, LibrarianId);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Approve a borrow request
const approveBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { returnDate } = req.body;
    // Validate returnDate
    if (!returnDate) {
      return res.status(400).json({ message: 'Invalid or missing return date' });
    }

    const result = await borrowService.approveBorrowRequest(requestId, returnDate);

    const { userId, LibrarianId, bookId } = result;

    res.status(200).json({ message: 'Request approved successfully', result });
    await sendemail.SendEmailOnApproveRequest(userId, bookId, LibrarianId , requestId);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reject a borrow request
const rejectBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await borrowService.rejectBorrowRequest(requestId);

    const { userId, LibrarianId, bookId } = result;

    res.status(200).json({ message: 'Request rejected successfully', result });
    await sendemail.SendEmailOnRejectRequest(userId, bookId, LibrarianId);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all borrow requests
const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await borrowService.getAllBorrowRequests();

    // Fetch book data concurrently for all requests
    const updatedRequests = await Promise.all(
      requests.map(async (request) => {
        const bookFromRepository = await bookRepository.getBookById(request.bookId);
        const bookFromAdminRepository = await AdminbookRepository.getBookById(request.bookId);

        // Assign book data or null if neither exists
        request.bookId = bookFromRepository || bookFromAdminRepository || null;
        return request;
      })
    );

    res.status(200).json({ message: 'All borrow requests fetched successfully', requests: updatedRequests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get borrow requests for a specific user
const getUserBorrowRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await borrowService.getUserBorrowRequests(userId);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No borrow requests found for this user.' });
    }

    // Fetch book data concurrently for all user borrow requests
    const updatedRequests = await Promise.all(
      requests.map(async (request) => {
        const bookFromRepository = await bookRepository.getBookById(request.bookId);
        const bookFromAdminRepository = await AdminbookRepository.getBookById(request.bookId);

        // Assign book data or null if neither exists
        request.bookId = bookFromRepository || bookFromAdminRepository || null;
        return request;
      })
    );

    res.status(200).json({ message: 'User borrow requests fetched successfully', requests: updatedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getLibrarianBorrowRequests = async (req, res) => {
  try {
    const LibrarianId = req.params.LibrarianId;
    const requests = await borrowService.getLibrarianBorrowRequests(LibrarianId);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No borrow requests found for this librarian.' });
    }

    // Fetch book data concurrently for all librarian borrow requests
    const updatedRequests = await Promise.all(
      requests.map(async (request) => {
        const bookFromRepository = await bookRepository.getBookById(request.bookId);
        const bookFromAdminRepository = await AdminbookRepository.getBookById(request.bookId);

        // Assign book data or null if neither exists
        request.bookId = bookFromRepository || bookFromAdminRepository || null;
        return request;
      })
    );

    res.status(200).json({ message: 'Librarian borrow requests fetched successfully', requests: updatedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Approve a borrow request
const returnBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { returnedDate } = req.body;
    // Validate returnDate
    if (!returnedDate) {
      return res.status(400).json({ message: 'Invalid or missing return date' });
    }

    const result = await borrowService.returnBorrowRequest(requestId, returnedDate);

    const { userId, LibrarianId, bookId } = result;

    res.status(200).json({ message: 'Request Returned successfully', result });
    await sendemail.SendEmailOnReturnedRequest(userId, bookId, LibrarianId , requestId);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  requestToBorrowBook,
  approveBorrowRequest,
  rejectBorrowRequest,
  returnBorrowRequest,
  getUserBorrowRequests,
  getAllBorrowRequests, // Add this line to export the new function
  getLibrarianBorrowRequests,
};


