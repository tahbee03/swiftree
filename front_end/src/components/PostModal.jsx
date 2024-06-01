import "./PostModal.css"; // Styles for Post Modal component

import Post from "./Post"; // <Post />

import { useEffect } from "react"; // useEffect()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useParams } from "react-router-dom"; // useParams()

export default function PostModal({ modalState, content }) {
    const { user } = useAuthContext(); // Contains data for logged in user
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL

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

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => modalState.setModal(null)}>&times;</div>
                <Post post={content} isAuthor={user && user.username === username} />
            </div>
        </div>
    );
}