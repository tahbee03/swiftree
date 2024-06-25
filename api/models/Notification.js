const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user_id: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
    icon: { type: String, required: true, default: "/swiftree_logo.png" },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);