import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

// Helper function to process image in Cloudinary
export async function updateImage({ selectedFile, public_id }) {
  if (public_id === "") { // Create image
    // Upload image to cloud
    const res = await cloudinary.uploader.upload(s, {
      folder: "user-pfps"
    });

    return {
      image: {
        public_id: res.public_id,
        url: res.secure_url
      }
    }
  } else if (selectedFile === "") { // Delete image
    // Remove image from cloud
    await cloudinary.uploader.destroy(public_id, (result) => {
      console.log(result);
    });

    return {
      image: {
        public_id: "",
        url: "/account_icon.png"
      }
    }
  } else { // Update image
    // Remove image from cloud
    await cloudinary.uploader.destroy(public_id, (result) => {
      console.log(result);
    });

    // Upload image to cloud
    const res = await cloudinary.uploader.upload(selectedFile, {
      folder: "user-pfps"
    });

    return {
      image: {
        public_id: res.public_id,
        url: res.secure_url
      }
    }
  }
}