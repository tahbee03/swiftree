import { useState } from "react";
import { useAuthContext } from "../context_and_hooks/AuthContext";

export default function PostForm() {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        const post = { author: user.username, content };

        // Create new post
        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify(post),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();

        if (!res.ok) setError(data.error);
        else {
            console.log("Post added!");
            setContent("");
            setError(null);
        }

        window.location.reload();
        // TODO: Figure out a way to re-render Profile page using React tools instead of window.location.reload();
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h3>New Post</h3>

            {/* <label>Content</label> */}
            <textarea onChange={(e) => setContent(e.target.value)} value={content}></textarea>
            <button>Submit Post</button>
            {error && <div>{error}</div>}
        </form>
    );
}