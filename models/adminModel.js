const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // To ensure the email is unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // You can increase the minimum length as per your requirement
  }
});

// Ensure only one admin can be registered by checking existing entry
adminSchema.statics.isAdminExist = async function () {
  const count = await this.countDocuments();
  if (count > 0) {
    throw new Error('An admin already exists');
  }
};

// Password hashing before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error);
  }
});

// Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
