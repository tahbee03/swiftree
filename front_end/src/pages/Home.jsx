import "./Home.css"; // Styles for Home page

import Navbar from "../components/Navbar"; // <Navbar />
import PostTree from "../components/PostTree"; // <PostTree />

import { useEffect, useState } from "react"; // useEffect(), useState()

export default function Home() {
    const [posts, setPosts] = useState(null); // Contains posts to be passed into post tree
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Runs on component render
    useEffect(() => {
        // Gets all posts from back-end
        const fetchPosts = async () => {
            setIsLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                setPosts(null);
            } else {
                setPosts(data);
                setError(null);
            }

            setIsLoading(false);
        };

        fetchPosts();
    }, []);

    // Renders elements
    return (
        <>
            <Navbar />
            <div className="container" id="home-cont">
                {error && (
                    <p className="error-msg">{error}</p>
                )}
                {isLoading && (
                    <div className="spinner-cont">
                        <span className="spinner-border"></span>
                    </div>
                )}
                {posts && !isLoading && (
                    <PostTree posts={posts} />
                )}
            </div>
        </>
    );
}