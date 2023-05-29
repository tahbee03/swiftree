const mongoose = require("mongoose"); // Include Mongoose library
const Schema = mongoose.Schema; // Create new schema

// Establish schema for posts i.e. define the structure of each database entry
const postSchema = new Schema({
    author: {type: String, required: true},
    content: {type: String, required: true}
}, {timestamps: true});

// NOTE: Including {timestamps: true} automatically creates createdAt and updatedAt attributes

// Create model using schema i.e. create the collection/relation/table
module.exports = mongoose.model("Post", postSchema);