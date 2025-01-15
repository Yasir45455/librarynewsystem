const authController = require('../controller/authController');
const express = require("express")
const authenticateAdmin = require('../middelwares/authMiddleware');

const router = express.Router();
// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/:id', authController.getUserById);
router.get('/',authenticateAdmin, authController.getAllUsers);
router.delete('/:id',authenticateAdmin, authController.deleteUser);
// router.delete('/:id', authController.deleteUser);
// router.get('/', authController.getAllUsers);

router.put('/:id',authenticateAdmin, authController.updateUser);


router.get('/api/verify-email', authController.verifyEmail);
module.exports = router;