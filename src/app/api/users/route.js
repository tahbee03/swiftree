import User from "@/models/User";
import connectDB from "@/lib/mongodb";

// GET /api/users
export async function GET(req, { params }) {
  try {
    await connectDB(); // Connect to database

    const users = await User.find({});
    if (users.length == 0) return new Response(JSON.stringify({ message: "There are no users!" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
    else return new Response(JSON.stringify({ users }), {
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