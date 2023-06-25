const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    posts: {type: [String], required: true}
});

module.exports = mongoose.model("User", userSchema);

// TODO: Figure out a way to allow users to have custom profile pictures