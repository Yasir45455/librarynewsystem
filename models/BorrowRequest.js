const mongoose = require('mongoose');

const BorrowRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'bookModel' // This will dynamically reference either 'Book' or 'AdminBook' based on the value of 'bookModel'
  },
  bookModel: { 
    type: String, 
    enum: ['Book', 'AdminBook'] // Ensure the model is either 'Book' or 'AdminBook'
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'returned'], default: 'pending' },
  LibrarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Library",
    required: true,
  },
  requestDate: { type: Date, default: Date.now },
  returnDate: { type: String, default: null },
  returnedDate: { type: String, default: null }
});

const BorrowRequest = mongoose.model('BorrowRequest', BorrowRequestSchema);

module.exports = BorrowRequest;
