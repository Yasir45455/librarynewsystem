const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  { timestamps: true }
);

// Validation: Ensure only one reference (user or admin) is populated
authorSchema.pre('save', function (next) {
  if (!this.user && !this.admin) {
    return next(new Error('Error'));
  }
  if (this.user && this.admin) {
    return next(new Error('Error'));
  }
  next();
});

module.exports = mongoose.model('Author', authorSchema);
