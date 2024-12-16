const libraryService = require('../services/libraryService');

// Add a new library
const addLibrary = async (req, res) => {
    try {
      const { userId, libraryName } = req.body;
      const result = await libraryService.addLibrary(userId, libraryName);
      res.status(201).json({ message: 'Library added successfully!', data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all libraries
const getAllLibraries = async (req, res) => {
  try {
    const result = await libraryService.getAllLibraries();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a library by ID
const getLibraryById = async (req, res) => {
  try {
    const result = await libraryService.getLibraryById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a library by ID
const updateLibraryById = async (req, res) => {
  try {
    const result = await libraryService.updateLibraryById(req.params.id, req.body);
    res.status(200).json({ message: 'Library updated successfully!', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a library by ID
const deleteLibraryById = async (req, res) => {
  try {
    await libraryService.deleteLibraryById(req.params.id);
    res.status(200).json({ message: 'Library deleted successfully!' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a library by ID
const getLibraryByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await libraryService.getLibraryByUserId(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  addLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibraryById,
  deleteLibraryById,
  getLibraryByUserId
};
