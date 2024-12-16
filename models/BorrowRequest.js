const mongoose = require('mongoose');

const BorrowRequestSchema = new mongoose.Schema({
 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // the book being requested
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  LibrarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Library",
    required: true,
  },
  requestDate: { type: Date, default: Date.now },
});

const BorrowRequest = mongoose.model('BorrowRequest', BorrowRequestSchema);

module.exports = BorrowRequest;
