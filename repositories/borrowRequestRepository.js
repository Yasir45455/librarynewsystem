const BorrowRequest = require('../models/BorrowRequest');
const { findRequest } = require('../services/borrowService');
// Create a new borrow request
const createBorrowRequest = async (LibrarianId,userId, bookId) => {
  const request = new BorrowRequest({
    LibrarianId,
    userId,
    bookId,
    status: 'pending',
  });
  return await request.save();
};
// Get all borrow requests
const getAllBorrowRequests = async () => {
    return await BorrowRequest.find().populate('bookId').populate('userId');
  };
// Get a specific borrow request by ID
const getBorrowRequestById = async (requestId) => {
  return await BorrowRequest.findById(requestId);
};

// Update borrow request status (approve/reject)
const updateBorrowRequestStatus = async (requestId, status) => {
  return await BorrowRequest.findByIdAndUpdate(requestId, { status }, { new: true });
};

findRequestsByUserId = async (userId) => {
  return BorrowRequest.find({ userId }).populate('bookId');
};

findRequestsByLibrarianId = async (LibrarianId) => {
  return BorrowRequest.find({ LibrarianId }).populate('bookId').populate('userId');
};

const findRequestOnce = async ({ userId, bookId }) => {

  return BorrowRequest.findOne({ userId, bookId })
    .populate('bookId')
    .populate('userId');
};

module.exports = {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  findRequestsByUserId,
  updateBorrowRequestStatus,
  findRequestsByLibrarianId,
  findRequestOnce
};
