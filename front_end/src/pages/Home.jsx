import "./Home.css"; // Styles for Home page
import { useEffect, useState } from "react"; // useEffect(), useState()
import Navbar from "../components/Navbar"; // <Navbar />
import PostTree from "../components/PostTree"; // <PostTree />

export default function Home() {
    const [posts, setPosts] = useState(null); // Contains posts to be passed into post tree
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Runs on component render
    useEffect(() => {
        // Gets all posts from back-end
        const fetchPosts = async () => {
            const res = await fetch("/api/posts");
            const data = await res.json();

            if (res.ok) setPosts(data);
            else setError(data);
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
                    <p>{error}</p>
                )}
            </div>
        </>
    );
}

// TODO: Make website responsive