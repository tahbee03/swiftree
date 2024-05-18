import { Schema, model, models } from "mongoose";

// Establish schema for posts i.e. define the structure of each database entry
const Post = new Schema({
  author_id: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

// NOTE: Including {timestamps: true} automatically creates createdAt and updatedAt attributes

// Create model using schema i.e. create the collection
export default models.Post || model("Post", Post);