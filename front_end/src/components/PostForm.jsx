import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import "./PostForm.css";

export default function PostForm({ modalState }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    // Run on mount
    useEffect(() => {
        const adjust = () => {
            const modalContent = document.querySelector(".modal-content");

            if (modalContent) {
                if (window.innerWidth < 576) modalContent.style.width = "90vw";
                else modalContent.style.width = "50vw";
            }
        };

        const close = (e) => {
            const classes = [...e.target.classList];
            if (classes.includes("modal")) modalState.setModal(null);
        };

        adjust();

        window.addEventListener("resize", adjust);
        window.addEventListener("click", close);

        return () => {
            window.addEventListener("resize", adjust);
            window.addEventListener("click", close);
        };
    }, []);

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit
        setIsLoading(true);
        for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none";

        const users = await (await fetch(`${process.env.REACT_APP_API_URL}/users`)).json();
        const match = users.filter((u) => u.username === user.username)[0];

        const post = { author_id: match._id, content };

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

        window.location.reload();
    }

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