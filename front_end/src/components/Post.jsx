import "./Post.css";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns"; // format(), formatDistanceToNow()

export default function Post({ post, canDelete }) {
    const { user, dispatch } = useAuthContext();
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const match = await (await fetch(`${process.env.REACT_APP_API_URL}/users/${post.author_id}`)).json();
            setAuthor(match);
        };

        fetchUser();
    }, []);

    async function handleClick(id) {
        setIsLoading(true);

        // Update user info
        const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${author._id}`, {
            method: "PATCH",
            body: JSON.stringify({
                mode: "POST",
                content: {
                    posts: author.posts.splice(author.posts.indexOf(id), 1)
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
                posts: author.posts.splice(author.posts.indexOf(id), 1),
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
        }

        // Delete post
        const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, { method: "DELETE" });

        if (res.ok) console.log("Post removed!");
        else console.log("Error removing post.");

        window.location.reload();
    }

    return (
        <div className="post row">
            <div className={`col-lg-9 col-12 info-section ${isLoading ? "loading" : ""}`}>
                <p className="content">{post.content}</p>
                <a href={(author) ? `/profile/${author.username}` : ""} className="author-section">
                    <img src={(author) ? author.image.url : "/account_icon.png"} alt="user-pfp" />
                    <p className="author">{(author) ? author.display_name : ""}</p>
                </a>
                {window.location.pathname === "/" && (
                    <p className="date">{`Posted ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}`}</p>
                )}
                {!(window.location.pathname === "/") && (
                    <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")} at ${format(new Date(post.createdAt), "hh:mm  a")} (${format(new Date(post.createdAt), "O")})`}</p>
                )}
            </div>
            <div className="col-lg-3 col-12 icon-section">
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