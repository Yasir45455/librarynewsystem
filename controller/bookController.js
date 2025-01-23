const bookService = require('../services/bookService');
const libraryService = require('../services/libraryService');

const createBook = async (req, res) => {
  try {
    const { user, admin, isbn, ...bookData } = req.body;
    // Validate the ISBN
    if (!isbn) {
      return res.status(400).json({ error: 'ISBN is required.' });
    }

    // Validate either user or admin is provided (not both)
    if ((user && admin) || (!user && !admin)) {
      return res.status(400).json({
        error: 'Either user or admin must be provided, but not both.'
      });
    }

    // Add user or admin reference
    if (user) {
      console.log(user)
      bookData.user = user;
      await bookService.findBookUniqueIsbn(user, isbn);
      const LibraryName = await libraryService.getLibraryByUserId(user);
      bookData.LibraryName = LibraryName.libraryName;
      console.log(LibraryName)

    } else if (admin) {
      bookData.admin = admin;
      await bookService.findBookUniqueIsbnforAdmin(admin, isbn);
    }

    // Add the ISBN to bookData
    bookData.isbn = isbn;

    // Handle the uploaded image
    if (req.file) {
      bookData.image = req.file.path; // Save the path of the uploaded image
    } else {
      return res.status(400).json({ error: 'Image is required.' });
    }

    // Create new book
    const newBook = await bookService.createBook(bookData);
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({ error: 'ISBN cannot be the same' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Books for a specific user
const getBooksByUserId = async (req, res) => {
  const { userId } = req.params; // Assuming you send userId in the request params

  try {
    const books = await bookService.getBooksByUserId(userId);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No books found for this user' });
    }

    // Structure the response in the desired format
    const response = {
      userId: userId,  // Include the userId in the response
      books: books // Include the categories array
    };

    res.status(200).json(response);  // Return the structured response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get Books for a specific user
const getBooksByAdminId = async (req, res) => {
  const { adminId } = req.params; // Assuming you send userId in the request params

  try {
    const books = await bookService.getBooksByAdminId(adminId);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No books found for this user' });
    }

    const response = {
      adminId: adminId,
      books: books
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const books = await bookService.getBooksByCategory(category);
    if (!books) {
      return res.status(404).json({ message: 'No books found for this category' });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedBook = await bookService.updateBook(id, updatedData);
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await bookService.deleteBook(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByUserId,
  getBooksByAdminId,
  getBooksByCategory

};
