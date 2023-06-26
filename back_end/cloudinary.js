const cloudinary = require("cloudinary").v2; // Library to access cloud storage for images

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports = cloudinary;