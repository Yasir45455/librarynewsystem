const libraryRepository = require('../repositories/libraryRepository');

// Add a new library
const addLibrary = async (userId, libraryName) => {
    if (!userId || !libraryName) {
      throw new Error('Both userId and libraryName are required.');
    }
    const libraryData = { userId, libraryName };
    try {
      return await libraryRepository.addLibrary(libraryData);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('This library name already exists for the given user.');
      }
      throw error;
    }
  };

// Get all libraries
const getAllLibraries = async () => await libraryRepository.getAllLibraries();

// Get a library by ID
const getLibraryById = async (id) => {
  const library = await libraryRepository.getLibraryById(id);
  if (!library) throw new Error('Library not found.');
  return library;
};

// Update a library by ID
const updateLibraryById = async (id, data) => {
  const library = await libraryRepository.updateLibraryById(id, data);
  if (!library) throw new Error('Library not found or could not be updated.');
  return library;
};

// Delete a library by ID
const deleteLibraryById = async (id) => {
  const library = await libraryRepository.deleteLibraryById(id);
  if (!library) throw new Error('Library not found or could not be deleted.');
  return library;
};

const getLibraryByUserId = async (userId) => {
  const library = await libraryRepository.getLibraryByUserId(userId);
  if (!library) throw new Error('Library not found.');
  return library;
};

module.exports = {
  addLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibraryById,
  deleteLibraryById,
  getLibraryByUserId
};
