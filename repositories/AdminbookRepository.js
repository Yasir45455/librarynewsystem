const AdminBook = require('../models/AdminBooks');

const createBook = async (bookData) => {
  const book = new AdminBook(bookData);
  return await book.save();
};

const getAllBooks = async () => {
  return await AdminBook.find();
};

 // Get Books by userId
const getBooksByUserId = async (userId) => {
  return await AdminBook.find({ user: userId }); 
};

 // Get Books by Admin Id
 const getBooksByAdminId = async (adminId) => {
  return await AdminBook.find({ admin: adminId });  
};

const getBookByISBN = async (isbn) => {
  return await AdminBook.findOne({ isbn });
};

const updateBook = async (id, updatedData) => {
  return await AdminBook.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteBook = async (id) => {
  return await AdminBook.findByIdAndDelete(id);
};

// Get a book by ID
const getBookById = async (bookId) => {
  return await AdminBook.findById(bookId);
};

// Update available copies of a book
const updateBookCopies = async (bookId, copies) => {
  return await AdminBook.findByIdAndUpdate(bookId, { availableCopies: copies }, { new: true });
};

const getBookByIsbnAndUser = async (user, isbn) => {
  return await AdminBook.findOne({ user, isbn }); // Assuming `Book` is your Mongoose model
};


const getBookByIsbnAndAdmin = async (admin, isbn) => {
  return await AdminBook.findOne({ admin, isbn }); 
};

// Repository
const getBooksByCategory = async (category) => {
  const sanitizedCategory = category.replace(-/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
  console.log(sanitizedCategory)
  return await AdminBook.find({ category: { $regex: new RegExp('^' + sanitizedCategory + '$', 'i') } });
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
