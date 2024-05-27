const cloudinary = require("cloudinary").v2; // Library to access cloud storage for images

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const updateImage = async ({ selectedFile: s, public_id: p }) => {
    /*
    NOTE:
    public_id -> image location in cloud filesystem
    url -> image location on the web
    */

    if (p === "") { // Create image
        // Upload image to cloud
        const res = await cloudinary.uploader.upload(s, { folder: "user-pfps" });

        return {
            image: {
                public_id: res.public_id,
                url: res.secure_url
            }
        }
    } else if (s === "") { // Delete image
        // Remove image from cloud
        await cloudinary.uploader.destroy(p);

        return {
            image: {
                public_id: "",
                url: "/account_icon.png"
            }
        }
    } else { // Update image
        // Remove image from cloud
        await cloudinary.uploader.destroy(p);

        // Upload image to cloud
        const res = await cloudinary.uploader.upload(s, { folder: "user-pfps" });

        return {
            image: {
                public_id: res.public_id,
                url: res.secure_url
            }
        }
    }
};

module.exports = { updateImage };