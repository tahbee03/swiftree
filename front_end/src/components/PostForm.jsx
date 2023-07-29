import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import "./PostForm.css";

export default function PostForm({ modalState }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const { user, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit
        setIsLoading(true);

        const post = { author: user.username, content };

        // Create new post
        const postRes = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
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
        const users = await (await fetch(`${process.env.REACT_APP_API_URL}/users`)).json();

        const match = users.filter((u) => u.username === user.username);

        let userPosts = match[0].posts;

        userPosts.push(postData._id);

        const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match[0]._id}`, {
            method: "PATCH",
            body: JSON.stringify({
                mode: "POST",
                content: {
                    posts: userPosts
                }
            }),
            headers: { "Content-Type": "application/json" }
        });
        const userData = await userRes.json();

        if (!userRes.ok) setError(userData.error);
        else {
            console.log("User updated!");

            const payload = {
                username: user.username,
                display_name: user.display_name,
                pfp: user.pfp,
                posts: userPosts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
        }

        setIsLoading(false);
        window.location.reload();
    }

    window.addEventListener("click", (e) => {
        const classes = [...e.target.classList];
        if (classes.includes("modal")) modalState.setModal(null);
    });

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => modalState.setModal(null)}>&times;</div>
                <form className="post-form" onSubmit={handleSubmit}>
                    <h3>New Post</h3>

                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        required
                    ></textarea>
                    <button type="submit" disabled={isLoading}>
                        {isLoading && (
                            <span className="spinner-border"></span>
                        )}
                        {!isLoading && (
                            <>
                                Submit Post
                            </>
                        )}
                    </button>
                    {error && <div>{error}</div>}
                </form>
            </div>
        </div>
    );
}