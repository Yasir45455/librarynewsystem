// repositories/notificationRepository.js
const Notification = require('../models/Notification');

const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

const getNotificationsByUser = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

const markNotificationAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

const deleteNotification = async (notificationId) => {
  return await Notification.findByIdAndDelete(notificationId);
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
};
