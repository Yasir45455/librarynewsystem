// routes/notificationRoutes.js
const express = require('express');
const notificationController = require('../controller/notificationController');

const router = express.Router();

router.post('/', notificationController.createNotification); 
router.get('/:userId', notificationController.getUserNotifications); 
router.put('/:notificationId/read', notificationController.markAsRead); 
router.delete('/:notificationId', notificationController.deleteNotification); 
router.get('/readall/:userId', notificationController.getLibrarianNotificationsAndReadAll); 


module.exports = router;