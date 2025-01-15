const Category = require('../models/category');

class CategoryRepository {
  // Create a new category
  static async createCategory(data) {
    const category = new Category(data);
    await category.save();
    return category;
  }

  // Get all categories
  static async getAllCategories() {
    return Category.find();
  }

  // Get categories by userId
  static async getCategoriesByUserId(userId) {
    return Category.find({ user: userId }) 
    .populate('user')  
    .populate('admin') 
    .exec();
  }
  

  // Get category by name
  static async getCategoryByName(categoryName) {
    return Category.findOne({ categoryName });
  }

  // Update category information
  static async updateCategory(id, data) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete a category by ID
  static async deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  }
}

module.exports = CategoryRepository;
