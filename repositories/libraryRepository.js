const Library = require('../models/Library');

// Add a new library
const addLibrary = async (data) => {
  const library = new Library(data);
  return await library.save();
};

// Get all libraries
const getAllLibraries = async () => await Library.find();

// Get a library by ID
const getLibraryById = async (id) => await Library.findById(id);

const getLibraryByUserId = async (userId) => await Library.findOne({ userId });;

// Update a library by ID
const updateLibraryById = async (id, data) => {
  return await Library.findByIdAndUpdate(id, data, { new: true });
};

// Delete a library by ID
const deleteLibraryById = async (id) => await Library.findByIdAndDelete(id);

module.exports = {
  addLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibraryById,
  deleteLibraryById,
  getLibraryByUserId
};
