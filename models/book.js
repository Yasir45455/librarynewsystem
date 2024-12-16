const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isbn: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  generation: { type: String, required: true },
  language: { type: String, required: true },
  publisher: { type: String, required: true },
  noOfPages: { type: Number, required: true },
  publishYear: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  image: {
    type: String,
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', 
  },
},
{ timestamps: true });

// Validation: Ensure only one reference (user or admin) is populated
bookSchema.pre('save', function (next) {
  if (!this.user && !this.admin) {
    return next(new Error('Error: Either user or admin must be provided.'));
  }
  if (this.user && this.admin) {
    return next(new Error('Error: Only one of user or admin should be provided.'));
  }
  next();
});

// Compound unique index for `isbn` and `user` or `admin`
// bookSchema.index({ isbn: 1, user: 1 }, { unique: true });
// bookSchema.index({ isbn: 1, admin: 1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
