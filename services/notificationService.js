// services/notificationService.js
const notificationRepository = require('../repositories/notificationRepository');
const Notification = require('../models/Notification'); // Adjust path as needed

const createNotification = async (data) => {
  // Add any business logic here if needed
  return await notificationRepository.createNotification(data);
};

const getUserNotifications = async (userId) => {
  return await notificationRepository.getNotificationsByUser(userId);
};

const markAsRead = async (notificationId) => {
  return await notificationRepository.markNotificationAsRead(notificationId);
};

const deleteNotification = async (notificationId) => {
  return await notificationRepository.deleteNotification(notificationId);
};
const markNotificationsAsRead = async (notificationIds) => {

console.log(notificationIds)

  return await Notification.updateMany(
    { _id: { $in: notificationIds } },
    { $set: { isRead: true } }
  );
};
module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  markNotificationsAsRead
};
