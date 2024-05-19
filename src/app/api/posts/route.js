import Post from "@/models/Post";
import connectDB from "@/lib/mongodb";

// GET /api/posts
export async function GET(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const posts = await Post.find({}).sort({ createdAt: -1 });
    if (posts.length == 0) return new Response(JSON.stringify({ message: "There are no posts!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404
    });
    else return new Response(JSON.stringify(posts), {
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

// POST /api/posts
export async function POST(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const { author_id, content } = req.body;

    const post = await Post.create({ author_id, content });
    return new Response(JSON.stringify(post), {
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