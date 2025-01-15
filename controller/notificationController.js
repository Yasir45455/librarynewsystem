// controllers/notificationController.js
const notificationService = require('../services/notificationService');

const createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updatedNotification = await notificationService.markAsRead(notificationId);
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getLibrarianNotificationsAndReadAll = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the notifications for the user
    const notifications = await notificationService.getUserNotifications(userId);

    // Filter notifications where isRead is false
    const unreadNotifications = notifications.filter(notification => !notification.isRead);

    // Update all unread notifications to isRead: true
    if (unreadNotifications.length > 0) {
      const notificationIds = unreadNotifications.map(notification => notification._id);

      // Assuming you have a method to update multiple notifications in your notificationService
      await notificationService.markNotificationsAsRead(notificationIds);
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getLibrarianNotificationsAndReadAll
};
