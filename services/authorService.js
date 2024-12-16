const AuthorRepository = require('../repositories/authorRepository');

class AuthorService {
  static async createAuthor(data) {
    // Check if only one of user or admin is provided, as per the schema validation logic
    if (!data.user && !data.admin) {
      throw new Error('Either user or admin must be specified.');
    }
    if (data.user && data.admin) {
      throw new Error('Only one of user or admin can be specified.');
    }

    return AuthorRepository.createAuthor(data);
  }

  static async getAllAuthors() {
    return AuthorRepository.getAllAuthors();
  }
 // Get Authors by userId
 static async getAuthorsByUserId(userId) {
  return AuthorRepository.getAuthorsByUserId(userId);
}
  static async getAuthorByName(name) {
    return AuthorRepository.getAuthorByName(name);
  }

  static async updateAuthor(id, data) {
    return AuthorRepository.updateAuthor(id, data);
  }

  static async deleteAuthor(id) {
    return AuthorRepository.deleteAuthor(id);
  }
}

module.exports = AuthorService;
