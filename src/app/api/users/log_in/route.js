import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// POST /api/users/log_in
export async function POST(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return new Response(JSON.stringify({ message: "Incorrect password!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload | secret | options

    return new Response(JSON.stringify({
      username: user.username,
      display_name: user.display_name,
      pfp: user.image.url,
      token
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Server error." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}