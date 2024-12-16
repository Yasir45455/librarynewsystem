const authController = require('../controller/authController');
const express = require("express")

const router = express.Router();
// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/:id', authController.getUserById);
router.get('/', authController.getAllUsers);
router.delete('/:id', authController.deleteUser);
router.put('/:id', authController.updateUser);
module.exports = router;