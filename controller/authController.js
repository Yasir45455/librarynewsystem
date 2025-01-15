const authService = require("../services/authService")
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');

// User Registration
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await authService.register(username, email, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await authService.login(email, password);
        
        res.cookie('token', token, { httpOnly: true });
        // res.cookie('token', token);
        res.status(200).json({ message: 'Login successful',token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Logout
const logout = (req, res) => {
    res.clearCookie('token'); // Clear the cookie
    res.status(200).json({ message: 'Logout successful' });
};
// Function to get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await authService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await authService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update a user by ID
const updateUser = async (req, res) => {
  try {
    const user = await authService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await userRepository.findByToken(hashedToken);

      if (!user || user.verificationTokenExpiry < new Date()) {
          throw new Error('Invalid or expired token');
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiry = null;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};



module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
  register,
  login,
  logout,
  verifyEmail
};
