const AuthorService = require('../services/authorService');

class AuthorController {
  // Create a new author
 // Create a new author
static async createAuthor(req, res) {
  const { name, userId, adminId } = req.body;

  try {
    // Ensure that only one of userId or adminId is provided
    if (!userId && !adminId) {
      return res.status(400).json({ error: 'Either userId or adminId must be provided.' });
    }

    if (userId && adminId) {
      return res.status(400).json({ error: 'Only one of userId or adminId can be provided.' });
    }

    // Prepare the data based on which ID is provided
    const authorData = {
      name,
      user: userId ? userId : undefined,
      admin: adminId ? adminId : undefined,
    };

    const newAuthor = await AuthorService.createAuthor(authorData);
    res.status(201).json({ message: 'Author created successfully', author: newAuthor });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({ error: 'Author with this name already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

  

  // Get all authors
  static async getAllAuthors(req, res) {
    try {
      const authors = await AuthorService.getAllAuthors();
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


    // Get authors by userId
static async getAuthorsByUserId(req, res) {
  const { userId } = req.params; // Assuming you send userId in the request params

  try {
    const authors = await AuthorService.getAuthorsByUserId(userId);

    if (!authors || authors.length === 0) {
      return res.status(404).json({ message: 'No authors found for this user' });
    }

    res.status(200).json(authors); // Return the authors
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  // Get author by name
  static async getAuthorByName(req, res) {
    const { name } = req.params;
    try {
      const author = await AuthorService.getAuthorByName(name);
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update author information
  static async updateAuthor(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const updatedAuthor = await AuthorService.updateAuthor(id, { name });
      if (!updatedAuthor) {
        return res.status(404).json({ message: 'Author not found' });
      }
      res.status(200).json({ message: 'Author updated successfully', author: updatedAuthor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete an author by ID
  static async deleteAuthor(req, res) {
    const { id } = req.params;
    try {
      const deletedAuthor = await AuthorService.deleteAuthor(id);
      if (!deletedAuthor) {
        return res.status(404).json({ message: 'Author not found' });
      }
      res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthorController;
