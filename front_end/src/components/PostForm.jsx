import { useState } from "react";
import { useAuthContext } from "../context_and_hooks/AuthContext";

export default function PostForm() {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const { user, dispatch } = useAuthContext();

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        const post = { author: user.username, content };

        // Create new post
        const postRes = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify(post),
            headers: { "Content-Type": "application/json" }
        });
        const postData = await postRes.json();

        if (!postRes.ok) setError(postData.error);
        else {
            console.log("Post added!");
            setContent("");
            setError(null);
        }

        // Update user info
        const users = await (await fetch("/api/users")).json();

        const match = users.filter((u) => u.username === user.username);

        let userPosts = match[0].posts;

        userPosts.push(postData._id);

        const userRes = await fetch(`/api/users/${match[0]._id}`, {
            method: "PATCH",
            body: JSON.stringify({ posts: userPosts }),
            headers: { "Content-Type": "application/json" }
        });
        const userData = await userRes.json();

        if (!userRes.ok) setError(userData.error);
        else {
            console.log("User updated!");
            console.log(userData);
            dispatch({ type: "UPDATE", payload: { username: user.username, posts: userPosts, token: user.token } });
            sessionStorage.setItem("user", JSON.stringify({ username: user.username, posts: userPosts, token: user.token }));
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