const express = require("express");
const { getNotifications, getNotification, createNotification, updateNotification, deleteNotification } = require("../controllers/notification_controller");

const router = express.Router();

// Get all notifications
router.get("/", getNotifications);

// Get specific notification
router.get("/:id", getNotification);

// Create new notification
router.post("/", createNotification);

// Update specific notification
router.patch("/:id", updateNotification);

// Delete specific notification
router.delete("/:id", deleteNotification);

module.exports = router;