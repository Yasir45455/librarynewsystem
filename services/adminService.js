const Admin = require('../models/adminModel');

class AdminService {
  // Create new admin
  static async createAdmin(adminData) {
    // Check if an admin already exists
    await Admin.isAdminExist();
    
    const admin = new Admin(adminData);
    await admin.save(); // Save the new admin to the database
    return admin;
  }

  // Find admin by email (for login or other purposes)
  static async findAdminByEmail(email) {
    return Admin.findOne({ email });
  }

    // Find admin by ID
    static async getAdminById(adminId) {
      try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
          throw new Error('Admin not found');
        }
        return admin;
      } catch (error) {
        throw new Error(`Error retrieving admin: ${error.message}`);
      }
    }

}

module.exports = AdminService;
