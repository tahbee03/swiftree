import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { updateImage } from "@/lib/imageProc";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// GET /api/users/[id]
export async function GET(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const user = await User.findById(id);
    if (!user) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify(user), {
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

// PATCH /api/users/[id]
export async function PATCH(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    if (req.body.mode === "IMAGE") req.body = await updateImage(req.body.content);
    else if (req.body.mode === "PASSWORD") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.content.password, salt);
      req.body = { password: hash };
    }
    else req.body = req.body.content;

    const user = await User.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!user) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify(user), {
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

// DELETE /api/users/[id]
export async function DELETE(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const user = await User.findOneAndDelete({ _id: id });
    if (!user) return new Response(JSON.stringify({ message: "No such user!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify({ message: "User successfully deleted!" }), {
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