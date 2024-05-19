import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { email, username, display_name, password } = req.body;

    const ematch = await User.find({ email });
    if (ematch.length != 0) return new Response(JSON.stringify({ message: "Email already in use!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const umatch = await User.find({ username: username.toLowerCase() });
    if (umatch.length != 0) return new Response(JSON.stringify({ message: "Username already in use!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      username: username.toLowerCase(),
      display_name,
      password: hash,
      image: { public_id: "", url: "/account_icon.png" }
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