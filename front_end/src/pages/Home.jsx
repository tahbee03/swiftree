import { useEffect, useState } from "react";
import Post from "../components/Post";

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

    console.log(posts);

    return (
        <div className="container">
            <div className="posts">
                {posts && posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}