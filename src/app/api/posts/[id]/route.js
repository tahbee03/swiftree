import Post from "@/models/Post";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// GET /api/posts/[id]
export async function GET(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const post = await Post.findById(id);
    if (!post) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify(post), {
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

// PATCH /api/posts/[id]
export async function POST(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const post = await Post.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!post) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify(post), {
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

// DELETE /api/posts/[id]
export async function DELETE(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });

    const post = await Post.findOneAndDelete({ _id: id });
    if (!post) return new Response(JSON.stringify({ message: "No such post!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify({ message: "Post successfully deleted!" }), {
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