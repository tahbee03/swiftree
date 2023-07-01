import "./Post.css";
import format from "date-fns/format";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useEffect, useState } from "react";

export default function Post({ post, canDelete }) {
    const { user, dispatch } = useAuthContext();
    const [userPic, setUserPic] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const match = await (await fetch(`/api/users/name-search/${post.author}`)).json();
            setUserPic(match.image.url);
        };

        fetchUser();
    }, [post.author]);

    async function handleClick(id) {
        setIsLoading(true);

        // Update user info
        const users = await (await fetch("/api/users")).json();
        const match = users.filter((u) => u.username === user.username);
        let userPosts = match[0].posts;
        userPosts.splice(userPosts.indexOf(id), 1);

        const userRes = await fetch(`/api/users/${match[0]._id}`, {
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

        if (!userRes.ok) console.log(userData.error);
        else {
            console.log("User updated!");

            const payload = {
                username: user.username,
                pfp: user.pfp,
                posts: userPosts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
        }

        // Delete post
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

        if (res.ok) console.log("Post removed!");
        else console.log("Error removing post.");

        setIsLoading(false);
        window.location.reload();
    }

    return (
        <div className="post row">
            <div className={`col-9 info-section ${isLoading ? "loading" : ""}`}>
                <p className="content">{post.content}</p>
                <a href={`/profile/${post.author}`} className="author-section">
                    <img src={(userPic === "") ? "/account_icon.png" : userPic} alt="user-pfp" />
                    <p className="author">{post.author}</p>
                </a>
                <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")}`}</p>
            </div>
            <div className="col-3 icon-section">
                {canDelete && (
                    <>
                        {isLoading && (
                            <span className="spinner-border"></span>
                        )}
                        {!isLoading && (
                            <img src="/delete_icon.png" alt="delete" onClick={() => handleClick(post._id)} id="delete-icon" />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}