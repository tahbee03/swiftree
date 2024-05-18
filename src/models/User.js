import { Schema, model, models } from "mongoose";

const User = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  display_name: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    public_id: { type: String },
    url: { type: String }
  }
});

export default models.User || model("User", User);

// TODO: Set a character limit for the username and display name length