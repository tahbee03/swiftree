const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    display_name: { type: String, required: true },
    password: { type: String, required: true },
    image: {
        public_id: { type: String },
        url: { type: String }
    },
    friends: [{
        user_id: { type: String },
        code: { type: String }
    }]
});

module.exports = mongoose.model("User", userSchema);