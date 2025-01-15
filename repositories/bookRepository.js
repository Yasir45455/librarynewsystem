const Book = require('../models/book');
const AdminBook = require('../models/AdminBooks');

const createBook = async (bookData) => {
  const book = new Book(bookData);
  return await book.save();
};

const getAllBooks = async () => {
  return await Book.find();
};

 // Get Books by userId
const getBooksByUserId = async (userId) => {
  return await Book.find({ user: userId }); 
};

 // Get Books by Admin Id
 const getBooksByAdminId = async (adminId) => {
  return await Book.find({ admin: adminId });  
};

const getBookByISBN = async (isbn) => {
  return await Book.findOne({ isbn });
};

const updateBook = async (id, updatedData) => {
  return await Book.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteBook = async (id) => {
  return await Book.findByIdAndDelete(id);
};

// Get a book by ID
const getBookById = async (bookId) => {
  return await Book.findById(bookId);
};

// Update available copies of a book
const updateBookCopies = async (bookId, copies) => {
  return await Book.findByIdAndUpdate(bookId, { availableCopies: copies }, { new: true });
};

const getBookByIsbnAndUser = async (user, isbn) => {
  return await Book.findOne({ user, isbn }); 
};


const getBookByIsbnAndAdmin = async (admin, isbn) => {
  return await Book.findOne({ admin, isbn }); 
};

// Repository
const getBooksByCategory = async (category) => {
  const sanitizedCategory = category.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

  const adminBooks = await AdminBook.find({ category: { $regex: new RegExp('^' + sanitizedCategory + '$', 'i') } });
  const books = await Book.find({ category: { $regex: new RegExp('^' + sanitizedCategory + '$', 'i') } });

  return [...adminBooks, ...books];
};


module.exports = {
  createBook,
  getAllBooks,
  getBookByISBN,
  updateBook,
  deleteBook,
  getBookById,
  updateBookCopies,
  getBooksByUserId,
  getBooksByAdminId,
  getBookByIsbnAndUser,
  getBookByIsbnAndAdmin,
  getBooksByCategory
};
