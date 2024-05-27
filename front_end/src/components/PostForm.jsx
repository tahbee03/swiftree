import "./PostForm.css"; // Styles for PostForm component

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { sleep, handleError } from "../utils"; // sleep(), handleError()

export default function PostForm({ setModal }) {
    const [content, setContent] = useState(""); // Contains data to put into post
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user

    // Runs when setModal() is loaded
    useEffect(() => {
        const close = (e) => {
            const classes = [...e.target.classList]; // Grab the list of classes that are detected
            if (classes.includes("modal")) setModal(null);
        };

        // Add event listeners to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
        window.addEventListener("click", close);

        // Remove event listeners from window when component unmounts
        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
            window.removeEventListener("click", close);
        }
    }, [setModal]);

    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        setIsLoading(true);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
                method: "POST",
                body: JSON.stringify({ author_id: user.id, content }),
                headers: { "Content-Type": "application/json" }
            });
            const postData = await postResponse.json();

            if (!postResponse.ok) throw new Error(postData.message);

            setContent("");
            setError(null);
            await sleep(1);
            window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto"; // Enable mouse
        }
    }

    return (
        <div className="modal">
            <div className={`modal-content ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <form className="post-form" onSubmit={handleSubmit}>
                    <h3>New Post</h3>
                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        required
                    >
                    </textarea>
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
                    {error && (
                        <div className="error-msg">{error}</div>
                    )}
                </form>
            </div>
        </div>
    );
}