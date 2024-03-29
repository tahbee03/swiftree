const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary");

const createToken = (id, email, username) => {
    return jwt.sign({id, email, username}, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload | secret | options
};

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});

    if(users.length == 0) res.status(400).json({error: "There are no users!"});
    else res.status(200).json(users);
};

// Get specific user
const getUserByID = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findById(id);

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

// Get specific user (via username)
// TODO: Remove and refactor (since it's not really necessary)
const getUserByName = async (req, res) => {
    const {username} = req.params;

    let usernameL = username.toLowerCase();

    try {
        const user = await User.findOne({
            username: usernameL
        });
        if(!user) throw Error(`The user '${usernameL}' does not exist!`);
        else res.status(200).json(user);
    } catch(err) {
        res.status(404).json({error: err.message});
    }
}

/// Login functionality
const userLogin = async (req, res) => {
    const {username, password} = req.body;

    let usernameL = username.toLowerCase();

    try {
        const user = await User.findOne({
            username: usernameL
        });
        if(!user) throw Error("Username not found!");

        const match = await bcrypt.compare(password, user.password);
        if(!match) throw Error("Incorrect password!");
        
        const token = createToken(user._id, user.email, user.username);
        res.status(200).json({
            username: user.username, 
            display_name: user.display_name, 
            pfp: user.image.url,
            token
        }); // Return data to be used in hooks

    } catch(err) {
        res.status(400).json({error: err.message});
    }

};

// Sign up functionality
const userSignUp = async (req, res) => {
    const {email, username, display_name, password} = req.body;

    let usernameL = username.toLowerCase();

    const ematch = await User.find({email});
    if(ematch.length != 0) return res.status(400).json({error: "Email already in use!"});

    const umatch = await User.find({
        username: usernameL
    });
    if(umatch.length != 0) return res.status(400).json({error: "Username already in use!"})

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            email, 
            username: usernameL, 
            display_name, 
            password: hash, 
            image: {public_id: "", url: "/account_icon.png"}
        });
        const token = createToken(user._id, user.email, user.username);
        res.status(200).json({
            username: user.username, 
            display_name: user.display_name, 
            pfp: user.image.url, 
            token
        }); // Return data to be used in hooks
    } catch(err) {
        console.log(err.message);
        res.status(400).json({error: err});
    }
};

const updateImage = async ({selectedFile: s, public_id: p}) => {
    if(p === "") { // Create image
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
    } else if(s === "") { // Delete image
        // Remove image from cloud
        await cloudinary.uploader.destroy(p, (result) => {
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
        await cloudinary.uploader.destroy(p, (result) => {
            console.log(result);
        });

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
    }
};

// Update specific user
const updateUser = async (req, res) => {
    const {id} = req.params; // ID of user to update
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    try {
        if(req.body.mode === "IMAGE") req.body = await updateImage(req.body.content);
        else if(req.body.mode === "PASSWORD") {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.content.password, salt);
            req.body = { password: hash };
        }
        else req.body = req.body.content;

        const user = await User.findByIdAndUpdate({_id: id}, {...req.body});
        if(!user) res.status(404).json({error: "No such user!"});
        else res.status(200).json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).json({error: err});
    }
};

// Delete specific user
const deleteUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findOneAndDelete({_id: id});

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

// Export functions to be used in other modules
module.exports = {getUsers, getUserByID, getUserByName, userLogin, userSignUp, updateUser, deleteUser};