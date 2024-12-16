const CategoryService = require('../services/categoryService');

class CategoryController {
  // Create a new category
  static async createCategory(req, res) {
    const { categoryName, userId, adminId } = req.body;

    try {
      if (!userId && !adminId) {
        return res.status(400).json({ error: 'Either userId or adminId must be provided.' });
      }
  
      if (userId && adminId) {
        return res.status(400).json({ error: 'Only one of userId or adminId can be provided.' });
      }
      const categoryData = {
        categoryName,
        user: userId ? userId : undefined,
        admin: adminId ? adminId : undefined,
      };
      const newCategory = await CategoryService.createCategory(categoryData);
      res.status(201).json({ message: 'Category created successfully', category: newCategory });


    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        res.status(400).json({ error: 'Category with this name already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Get all categories (for all users)
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get categories for a specific user
  static async getCategoriesByUserId(req, res) {
    const { userId } = req.params; // Assuming you send userId in the request params
  
    try {
      const categories = await CategoryService.getCategoriesByUserId(userId);
      
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: 'No categories found for this user' });
      }
  
      // Structure the response in the desired format
      const response = {
        userId: userId,  // Include the userId in the response
        categories: categories // Include the categories array
      };
  
      res.status(200).json(response);  // Return the structured response
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

  // Get category by name
  static async getCategoryByName(req, res) {
    const { categoryName } = req.params;

    try {
      const category = await CategoryService.getCategoryByName(categoryName);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update category information
  static async updateCategory(req, res) {
    const { id } = req.params;
    const { categoryName } = req.body;

    try {
      const updatedCategory = await CategoryService.updateCategory(id, { categoryName });
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a category by ID
  static async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      const deletedCategory = await CategoryService.deleteCategory(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
