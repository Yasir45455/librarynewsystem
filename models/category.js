const mongoose = require('mongoose');

// Assuming you have a User model, reference the User collection here
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to the Admin model
    },
  },
  { timestamps: true }  // Automatically adds 'createdAt' and 'updatedAt'
);

// Validation: Ensure only one reference (user or admin) is populated
categorySchema.pre('save', function (next) {
  if (!this.user && !this.admin) {
    return next(new Error('Error'));
  }
  if (this.user && this.admin) {
    return next(new Error('Error'));
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
