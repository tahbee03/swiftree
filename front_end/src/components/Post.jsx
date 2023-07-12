import "./Post.css";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns"; // format(), formatDistanceToNow()

export default function Post({ post, canDelete }) {
    const { user, dispatch } = useAuthContext();
    const [userPic, setUserPic] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const match = await (await fetch(`${process.env.REACT_APP_API_URL}/users/name-search/${post.author}`)).json();
            setUserPic(match.image.url);
            setDisplayName(match.display_name);
        };

        fetchUser();
    }, [post.author]);

    async function handleClick(id) {
        setIsLoading(true);

        // Update user info
        const users = await (await fetch(`${process.env.REACT_APP_API_URL}/users`)).json();
        const match = users.filter((u) => u.username === user.username);
        let userPosts = match[0].posts;
        userPosts.splice(userPosts.indexOf(id), 1);

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

        if (!userRes.ok) console.log(userData.error);
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

        // Delete post
        const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, { method: "DELETE" });

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
                    <p className="author">{displayName}</p>
                </a>
                {window.location.pathname === "/" && (
                    <p className="date">{`Posted ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}`}</p>
                )}
                {!(window.location.pathname === "/") && (
                    <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")} at ${format(new Date(post.createdAt), "hh:mm  a")} (${format(new Date(post.createdAt), "O")})`}</p>
                )}
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