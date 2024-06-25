const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification.find({}).sort({ createdAt: -1 });
        return res.status(200).json(notifs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Get specific notification
const getNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such notification!" });

        const notif = await Notification.findById(id);
        if (!notif) return res.status(404).json({ message: "No such notification!" });
        else return res.status(200).json(notif);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Create new notification
const createNotification = async (req, res) => {
    try {
        const { user_id, message, icon, link } = req.body;
        const notif = await Notification.create({ user_id, message, icon, link });
        return res.status(200).json(notif);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Update specific notification
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such notification!" });

        const notif = await Notification.findByIdAndUpdate({ _id: id }, { ...req.body });
        if (!notif) return res.status(404).json({ message: "No such notification!" });
        else return res.status(200).json(notif);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Delete specific notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such notification!" });

        const notif = await Notification.findOneAndDelete({ _id: id });
        if (!notif) return res.status(404).json({ message: "No such notification!" });
        else return res.status(200).json(notif);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

module.exports = { getNotifications, getNotification, createNotification, updateNotification, deleteNotification };