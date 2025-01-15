const User = require('../models/user');

// Find a user by email
const findByEmail = async (email) => {
    return await User.findOne({ email });
};

// Create a new user
const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

// Function to find a user by their ID
const findUserById = async (userId) => {
  return await User.findById(userId);
};

// Function to find all users
const findAllUsers = async () => {
  return await User.find();
};

// Function to delete a user by their ID
const removeUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

// Function to update a user's data
const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};


const findByToken = async (hashedToken) => {
  return User.findOne({ verificationToken: hashedToken });
};



module.exports = {
  findUserById,
  findAllUsers,
  removeUserById,
  updateUserById,
  findByEmail,
  createUser,
  findByToken
};
