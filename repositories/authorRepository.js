const Author = require('../models/author');

class AuthorRepository {
  // Create a new author
  static async createAuthor(data) {
    const author = new Author(data);
    await author.save();
    return author;
  }

  // Get all authors
  static async getAllAuthors() {
    return Author.find();
  }
// Get Authors by userId
static async getAuthorsByUserId(userId) {
  return Author.find({ user: userId }) 
    .populate('user')  
    .populate('admin') 
    .exec();
}

  // Get author by name
  static async getAuthorByName(name) {
    return Author.findOne({ name });
  }

  // Update author information
  static async updateAuthor(id, data) {
    return Author.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete an author by ID
  static async deleteAuthor(id) {
    return Author.findByIdAndDelete(id);
  }
}

module.exports = AuthorRepository;
