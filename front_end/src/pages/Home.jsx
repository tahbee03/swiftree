import "./Home.css"; // Styles for Home page

import Navbar from "../components/Navbar"; // <Navbar />
import PostTree from "../components/PostTree"; // <PostTree />

import { useEffect, useState } from "react"; // useEffect(), useState()

// require("dotenv").config();

export default function Home() {
    const [posts, setPosts] = useState(null); // Contains posts to be passed into post tree
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Runs on component render
    useEffect(() => {
        // Gets all posts from back-end
        const fetchPosts = async () => {
            const res = await fetch(`${process.env.API_URL}/posts`);
            // const res = await fetch(`${window.location.origin}/api/posts`);
            const data = await res.json();

            if (!res.ok) setError(data.error);
            else setPosts(data);
        };

        fetchPosts();
    }, []);

    // Renders elements
    return (
        <>
            <Navbar />
            <div className="container" id="home-cont">
                {posts && (
                    <PostTree posts={posts} />
                )}
                {!posts && (
                    <p className="error-msg">{error}</p>
                )}
            </div>
        </>
    );
}

// TODO: Make website responsive
// TODO: Create a global error state (context) instead of redefining it in every component