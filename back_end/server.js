require("dotenv").config(); // Connect environment variables from .env file to process.env object
const express = require("express"); // Include Express.js package
const posts_api = require("./routes/posts_api"); // Include routes for application
const mongoose = require("mongoose"); // Include Mongoose library

const app = express(); // Instantiate Express.js app

app.use(express.json()); // ???

app.get("/", (req, res) => {
    // req -> request to endpoint
    // res -> response from server
    res.json({msg: "Welcome!"});
});

// Allows the app to use the routes defined in posts_api.js
app.use("/api/posts", posts_api);

// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database!");

        // Listen for requests (after connecting to database)
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}...`);
        });
    })
    .catch((err) => {
        console.log(err);
    });