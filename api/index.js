require("dotenv").config(); // Connect environment variables from .env file to process.env object
const express = require("express"); // Include Express.js package
const posts_api = require("./routes/posts_api"); // Include API routes for posts
const users_api = require("./routes/users_api"); // Include API routes for users 
const notifications_api = require("./routes/notifications_api"); // Incluse API routes for notifications
const mongoose = require("mongoose"); // Include Mongoose library
const cors = require("cors");

const app = express(); // Instantiate Express.js app

app.use(cors());

app.use(express.json({ limit: "100MB" })); // Custom request body size (to process larger files)

// req -> request to endpoint
// res -> response from server

// Routes for post API
app.use("/api/posts", posts_api);

// Routes for user API
app.use("/api/users", users_api);

// Routes for notifications API
app.use("/api/notifications", notifications_api);

// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database!");

        if (process.env.PORT) {
            // Listen for requests (after connecting to database)
            app.listen(process.env.PORT, () => {
                console.log(`Listening on port ${process.env.PORT}...`);
            });
        }

        // Export app to expose routes to Vercel
        module.exports = app;
    })
    .catch((err) => {
        console.log(err);
    });