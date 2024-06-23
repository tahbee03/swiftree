const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { updateImage } = require("../cloudinary");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Get specific user
const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Login functionality
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(404).json({ message: "Username not found!" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(404).json({ message: "Incorrect password!" });

        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload, secret, options
        return res.status(200).json({
            id: user._id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            pfp: user.image.url,
            friends: user.friends,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Sign up functionality
const userSignUp = async (req, res) => {
    try {
        const { email, username, display_name, password } = req.body;

        const ematch = await User.find({ email });
        if (ematch.length != 0) return res.status(400).json({ message: "Email already in use!" });

        const umatch = await User.find({ username: username.toLowerCase() });
        if (umatch.length != 0) return res.status(400).json({ message: "Username already in use!" })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            username: username.toLowerCase(),
            display_name,
            password: hash,
            image: { public_id: "", url: "/account_icon.png" }
        });
        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload, secret, optionsconst token = createToken(user._id, user.email, user.username);
        return res.status(200).json({
            id: user._id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            pfp: user.image.url,
            friends: user.friends,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

const friendControl = async (req, res) => {
    const getMatchID = (list, key, value) => { // Return index of object in array
        for (let i in list) {
            if (list[i][key] === value) return Number(i);
        }

        return -1;
    }

    const send = async (s, r) => { // Send friend request
        const match = getMatchID(r.friends, "user_id", s._id.toString());

        if (match === -1) { // The sender is not in the receiver's friend list
            s.friends.push({
                user_id: r._id,
                code: "SR"
            });
            await s.save();

            r.friends.push({
                user_id: s._id,
                code: "RR"
            });
            await r.save();

            return res.status(200).json({ message: "Friend request sent." });
        } else { // The sender is in the receiver's friend list
            switch (r.friends[match].code) {
                case "SR":
                    return res.status(400).json({ message: "You have already a pending friend request from this user." });
                case "RR":
                    return res.status(400).json({ message: "You have already sent a friend request to this user." });
                case "CR":
                    return res.status(400).json({ message: "You are already friends with this user." });
            }
        }
    };

    const revoke = async (s, r) => { // Remove friend request
        const match = getMatchID(r.friends, "user_id", s._id.toString());

        if (match === -1) { // The sender is not in the receiver's friend list
            return res.status(400).json({ message: "You have not sent a request to this user." });
        } else { // The sender is in the receiver's friend list
            switch (r.friends[match].code) {
                case "SR":
                    return res.status(400).json({ message: "You have a pending request from this user." });
                case "RR":
                    s.friends = s.friends.filter(f => f.user_id !== r._id);
                    await s.save();

                    r.friends = r.friends.filter(f => f.user_id !== s._id);
                    await r.save();

                    return res.status(200).json({ message: "Friend request removed." });
                case "CR":
                    return res.status(400).json({ message: "You are already friends with this user." });
            }
        }
    };

    const accept = async (s, r) => { // Accept friend request
        const matchS = getMatchID(r.friends, "user_id", s._id.toString());

        if (matchS === -1) { // The sender is not in the receiver's friend list
            return res.status(400).json({ message: "The user has not sent you a friend request." });
        } else { // The sender is in the receiver's friend list
            switch (r.friends[matchS].code) {
                case "SR":
                    const matchR = getMatchID(s.friends, "user_id", r._id.toString());
                    s.friends[matchR].code = "CR";
                    await s.save();

                    r.friends[matchS].code = "CR";
                    await r.save();

                    return res.status(200).json({ message: "Friend request accepted." });
                case "RR":
                    return res.status(400).json({ message: "The user already has a pending request from you." });
                case "CR":
                    return res.status(400).json({ message: "You are already friends with this user." });
            }
        }
    };

    const decline = async (s, r) => { // Decline friend request
        const match = getMatchID(r.friends, "user_id", s._id.toString());

        if (match === -1) { // The sender is not in the receiver's friend list
            return res.status(400).json({ message: "The user has not sent you a friend request." });
        } else { // The sender is in the receiver's friend list
            switch (r.friends[match].code) {
                case "SR":
                    s.friends = s.friends.filter(f => f.user_id !== r._id);
                    await s.save();

                    r.friends = r.friends.filter(f => f.user_id !== s._id);
                    await r.save();

                    return res.status(200).json({ message: "Friend request declined." });
                case "RR":
                    return res.status(400).json({ message: "The user already has a pending request from you." });
                case "CR":
                    return res.status(400).json({ message: "You are already friends with this user." });
            }
        }
    };

    const remove = async (s, r) => { // Remove friend
        const match = getMatchID(r.friends, "user_id", s._id.toString());

        if (match === -1) { // The sender is not in the receiver's friend list
            return res.status(400).json({ message: "You are not friends with this user." });
        } else { // The sender is in the receiver's friend list
            switch (r.friends[match].code) {
                case "SR":
                    return res.status(400).json({ message: "You have a pending request from this user." });
                case "RR":
                    return res.status(400).json({ message: "The user already has a pending request from you." });
                case "CR":
                    s.friends = s.friends.filter(f => f.user_id !== r._id);
                    await s.save();

                    r.friends = r.friends.filter(f => f.user_id !== s._id);
                    await r.save();

                    return res.status(200).json({ message: "Friend removed." });
            }
        }
    };

    try {
        const fromID = req.body.from;
        const toID = req.body.to;

        const sender = await User.findById(fromID); // User carrying out specific action
        if (!sender) return res.status(404).json({ message: "Unknown sender ID!" });

        const receiver = await User.findById(toID); // User waiting on response
        if (!receiver) return res.status(404).json({ message: "Unknown receiver ID!" });

        switch (req.body.action) {
            case "send":
                return send(sender, receiver);
            case "revoke":
                return revoke(sender, receiver);
            case "accept":
                return accept(sender, receiver);
            case "decline":
                return decline(sender, receiver);
            case "remove":
                return remove(sender, receiver);
            default:
                return res.status(400).json({ message: "Unknown friend action!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Update specific user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        if (req.body.mode === "IMAGE") req.body = await updateImage(req.body.content);
        else if (req.body.mode === "PASSWORD") {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.content.password, salt);
            req.body = { password: hash };
        }
        else req.body = req.body.content;

        const user = await User.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Delete specific user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        const user = await User.findOneAndDelete({ _id: id });
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json({ message: "User successfully deleted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Export functions to be used in other modules
module.exports = { getUsers, getUser, userLogin, userSignUp, friendControl, updateUser, deleteUser };