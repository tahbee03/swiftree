import "./PostModal.css"; // Styles for Post Modal component

import Post from "./Post"; // <Post />

import { useEffect, useState } from "react"; // useEffect(), useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export default function PostModal({ setModal, post }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

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
        };
    }, [setModal]);

    // Checks if the available credentials allow the post to be manipulated (edit and delete)
    function checkAuthor() {
        /* 
        criteria:
        - user needs to be logged in
        - has to be on the Profile page -> pathPattern.test(path)
        - the ID of the author of the post needs to match the ID of the authenticated user -> post.author_id === user.id
        */

        const pathPattern = /\/profile\/.+/g;
        const path = window.location.pathname;

        if (user) return pathPattern.test(path) && post.author_id === user.id;
        else return false;
    }

    return (
        <div className="modal">
            <div className={`modal-content post-modal ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <Post post={post} isAuthor={checkAuthor()} />
            </div>
        </div>
    );
}