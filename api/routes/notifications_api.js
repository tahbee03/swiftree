const express = require("express");
const { getNotifications, getNotification, createNotification, deleteNotification } = require("../controllers/notification_controller");

const router = express.Router();

// Get all notifications
router.get("/", getNotifications);

// Get specific notification
router.get("/:id", getNotification);

// Create new notification
router.post("/", createNotification);

// Delete specific notification
router.delete("/:id", deleteNotification);

module.exports = router;