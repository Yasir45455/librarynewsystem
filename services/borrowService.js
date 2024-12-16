const borrowRequestRepository = require('../repositories/borrowRequestRepository');
const bookRepository = require('../repositories/bookRepository')

// Request to borrow a book
const requestToBorrowBook = async (LibrarianId , userId, bookId) => {
    const book = await bookRepository.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (book.availableCopies <= 0) {
      throw new Error('No copies available for borrowing');
    }
    return await borrowRequestRepository.createBorrowRequest(LibrarianId , userId, bookId);
  };
  
  // Approve borrow request
  const approveBorrowRequest = async (requestId) => {
    const request = await borrowRequestRepository.getBorrowRequestById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    
    if (request.status !== 'pending') {
      throw new Error('Request is already approved or rejected');
    }
  
    const book = await bookRepository.getBookById(request.bookId);
    if (!book) {
      throw new Error('Book not found');
    }
  
    if (book.availableCopies <= 0) {
      throw new Error('No copies available to approve the request');
    }
  
    // Update the book's available copies
    await bookRepository.updateBookCopies(request.bookId, book.availableCopies - 1);
  
    // Update the borrow request status to approved
    return await borrowRequestRepository.updateBorrowRequestStatus(requestId, 'approved');
  };
  
  // Reject borrow request
  const rejectBorrowRequest = async (requestId) => {
    const request = await borrowRequestRepository.getBorrowRequestById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
  
    if (request.status !== 'pending') {
      throw new Error('Request is already approved or rejected');
    }
  
    // Update the borrow request status to rejected
    return await borrowRequestRepository.updateBorrowRequestStatus(requestId, 'rejected');
  };
  
 
  

// Get all borrow requests
const getAllBorrowRequests = async () => {
  return await borrowRequestRepository.getAllBorrowRequests();
};


const getUserBorrowRequests = async (userId) => {
  return borrowRequestRepository.findRequestsByUserId(userId);
};

const getLibrarianBorrowRequests = async (LibrarianId) => {
  return borrowRequestRepository.findRequestsByLibrarianId(LibrarianId);
};
const findRequestOnce = async (userId, bookId) => {
  const existingRequests = await borrowRequestRepository.getAllBorrowRequests({ userId, bookId });
  // Check for any pending request
  const pendingRequest = existingRequests.find(request => 
    request.userId && request.userId._id && 
    request.bookId && request.bookId._id &&
    userId.toString() === request.userId._id.toString() && 
    bookId.toString() === request.bookId._id.toString() && 
    request.status === 'pending'
  );
  
  if (pendingRequest) {
    throw new Error('You already have a pending request for this book.');
  }
  // Return all existing requests for logging or other checks if needed
  return existingRequests;
};
module.exports = {
    requestToBorrowBook,
    approveBorrowRequest,
    rejectBorrowRequest,
    getAllBorrowRequests,
    getUserBorrowRequests,
    getLibrarianBorrowRequests,
    findRequestOnce
};
