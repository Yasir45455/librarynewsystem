const mongoose = require('mongoose');
const LibrarySchema = new mongoose.Schema(
    {
        userId:
        {
            type: String,
            required: true,
            unique: true
        },
        libraryName: { type: String, required: true, unique: true },
    }
);

// Ensure indexes are created
LibrarySchema.index({ userId: 1 }, { unique: true });
LibrarySchema.index({ libraryName: 1 }, { unique: true });
module.exports = mongoose.model('Library', LibrarySchema);