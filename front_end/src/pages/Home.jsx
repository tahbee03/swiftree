import "./Home.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostTree from "../components/PostTree";

export default function Home() {
    const [posts, setPosts] = useState(null);

    // Fire function when component is rendered
    // NOTE: An empty dependency array is passed in so this is only called once
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts");
            const data = await res.json();

            if (res.ok) {
                setPosts(data);
            }
        };

        fetchPosts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" id="home-cont">
                {posts && (
                    <PostTree posts={posts} />
                )}
                {!posts && (
                    <p>There are no posts!</p>
                )}
            </div>
        </>
    );
}

// TODO: Make website responsive