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

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                const now = new Date().getTime();
                setPosts(data.filter((p) => (now - new Date(p.createdAt).getTime()) < (3600000 * 24)));
            } catch (error) {
                console.log(error);
                setPosts(null);
                setError(error);
            }

            setIsLoading(false);
        };

        setError(null);
        fetchPosts();
    }, []);

    // Renders elements
    return (
        <>
            <Helmet>
                {/* Default meta tags */}
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
                    <PostTree posts={(posts.length > 14) ? posts.slice(0, 14) : posts} page={"home"} />
                )}
            </div>
        </>
    );
}