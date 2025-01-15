const AdminService = require('../services/adminService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication

class AdminController {
  // Admin registration
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      // Call the service layer to create the admin
      const admin = await AdminService.createAdmin({ email, password });

      // Optionally, create a JWT token for the new admin (if you're using JWT)
      const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({
        message: 'Admin registered successfully!',
        token
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Admin login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await AdminService.findAdminByEmail(email);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token for login
      const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({
        message: 'Login successful!',
        token
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
}

module.exports = AdminController;
