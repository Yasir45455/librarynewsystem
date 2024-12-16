const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// Register a new user
const register = async (username, email, password) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser({ username, email, password: hashedPassword });
};

// Login user
const login = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    return { token, user };
};

// Function to get a user by ID
const getUserById = async (userId) => {
  return await userRepository.findUserById(userId);
};

// Function to get all users
const getAllUsers = async () => {
  return await userRepository.findAllUsers();
};

// Function to delete a user by ID
const deleteUser = async (userId) => {
  return await userRepository.removeUserById(userId);
};

// Function to update a user by ID
const updateUser = async (userId, updateData) => {
  return await userRepository.updateUserById(userId, updateData);
};

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
  register,
  login,
};
