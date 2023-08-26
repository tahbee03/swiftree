import "./Home.css"; // Styles for Home page

import Navbar from "../components/Navbar"; // <Navbar />
import PostTree from "../components/PostTree"; // <PostTree />

import { useEffect, useState } from "react"; // useEffect(), useState()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Home() {
    const [posts, setPosts] = useState(null); // Contains posts to be passed into post tree
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null);

    // Runs on component render
    useEffect(() => {
        // Gets all posts from back-end
        const fetchPosts = async () => {
            setIsLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const data = await res.json();

            if (!res.ok) {
                // setError(data.error);
                setPosts(null);
                throw Error(data.error);
            } else {
                const now = new Date().getTime();
                setPosts(data.filter((p) => (now - new Date(p.createdAt).getTime()) < (3600000 * 24)));
                // setError(null);
            }

            /*
            1 hour = 3600000 milliseconds
            => 24 hours = (3600000 * 24) milliseconds
            
            new Date().getTime() -> milliseconds since Unix epoch
            => new Date(a).getTime() - new Date(b).getTime() -> time difference between times a and b in milliseconds
            */

            setIsLoading(false);
        };

        try {
            fetchPosts();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Renders elements
    return (
        <>
            <Helmet>
                <title>Swiftree</title>
                <meta name="description" content="Welcome to Swiftree!" />
            </Helmet>
            <Navbar />
            <div className="container-md" id="home-cont">
                {error && (
                    <p className="error-msg">{error}</p>
                )}
                {isLoading && (
                    <div className="spinner-cont">
                        <span className="spinner-border"></span>
                    </div>
                )}
                {posts && !isLoading && (
                    <PostTree posts={posts} page={"home"} />
                )}
            </div>
        </>
    );
}