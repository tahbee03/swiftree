import { useState } from "react";

export default function PostForm() {
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        const post = { author, content };

        // POST request using fetch()
        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify(post),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();

        if (!res.ok) setError(data.error);
        else {
            console.log("Post added!");
            setAuthor("");
            setContent("");
            setError(null);
        }
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h3>New Post</h3>

            <label>Content</label>
            <textarea onChange={(e) => setContent(e.target.value)} value={content}></textarea>
            <label>Author</label>
            <input type="text" onChange={(e) => setAuthor(e.target.value)} value={author}></input>

            <button>Submit Post</button>
            {error && <div>{error}</div>}
        </form>
    );
}