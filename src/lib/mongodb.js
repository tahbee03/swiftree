import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Connect to database using URI in .env
    console.log("Connected to database!"); // Confirmation message
    return true;
  } catch (error) {
    console.log(error);
  }
}