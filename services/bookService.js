const bookRepository = require('../repositories/bookRepository');

const createBook = async (bookData) => {
  return await bookRepository.createBook(bookData);
};

const getAllBooks = async () => {
  return await bookRepository.getAllBooks();
};

 // Get Books by userId
 const  getBooksByUserId = async (userId) => {
  return await bookRepository.getBooksByUserId(userId);
}

const getBookById = async (id) => {
  return await bookRepository.getBookById(id);
};

const updateBook = async (id, updatedData) => {
  return await bookRepository.updateBook(id, updatedData);
};

const deleteBook = async (id) => {
  return await bookRepository.deleteBook(id);
};


 // Get Books by adminId
 const  getBooksByAdminId = async (adminId) => {
  return await bookRepository.getBooksByAdminId(adminId);
}


const findBookUniqueIsbn = async (user, isbn) => {
  // Check if a book with the same ISBN already exists for the user
  const existingBook = await bookRepository.getBookByIsbnAndUser(user, isbn);
  if (existingBook) {
    throw new Error('Same ISBN already exists for this user');
  }

  return true; // Return true if no duplicate found
};
const findBookUniqueIsbnforAdmin = async (admin, isbn) => {
  // Check if a book with the same ISBN already exists for the admin
  const existingBook = await bookRepository.getBookByIsbnAndAdmin(admin, isbn);
  if (existingBook) {
    throw new Error('Same ISBN already exists for this user');
  }

  return true; // Return true if no duplicate found
};

// Service
const getBooksByCategory = async (category) => {
  // Call the repository to fetch books by category
  return await bookRepository.getBooksByCategory(category);
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByUserId,
  getBooksByAdminId,
  findBookUniqueIsbn,
  findBookUniqueIsbnforAdmin,
  getBooksByCategory
};
