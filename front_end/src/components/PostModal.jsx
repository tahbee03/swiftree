import "./PostModal.css"; // Styles for Post Modal component

import Post from "./Post"; // <Post />

import { useEffect, useState } from "react"; // useEffect(), useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useParams } from "react-router-dom"; // useParams()

export default function PostModal({ setModal, content }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

    const { user } = useAuthContext(); // Contains data for logged in user
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL

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
        };
    }, [setModal]);

    return (
        <div className="modal">
            <div className={`modal-content ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <Post post={content} isAuthor={user && user.username === username} />
            </div>
        </div>
    );
}