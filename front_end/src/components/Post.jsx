import "./Post.css";
import format from "date-fns/format";
import { useState } from "react";
import { useAuthContext } from "../context_and_hooks/AuthContext";

export default function Post({ post, canDelete }) {
    const [error, setError] = useState(null);
    const { user, dispatch } = useAuthContext();

    async function handleClick(id) {

        // Update user info
        const users = await (await fetch("/api/users")).json();
        const match = users.filter((u) => u.username === user.username);
        let userPosts = match[0].posts;
        userPosts.splice(userPosts.indexOf(id), 1);

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

        // Delete post
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

        if (res.ok) console.log("Post removed!");
        else console.log("Error removing post.");

        window.location.reload();
        // TODO: Figure out a way to re-render Profile page using React tools instead of window.location.reload();
    }

    return (
        <div className="post row">
            <div className="col-9 info-section">
                <p className="content">{post.content}</p>
                <p className="author">{post.author}</p>
                <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")}`}</p>
            </div>
            <div className="col-3 icon-section">
                {canDelete && (
                    <img src="/delete_icon.png" alt="delete" onClick={() => handleClick(post._id)} id="delete-icon" />
                )}
            </div>
        </div>
    );
}