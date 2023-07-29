import "./PostModal.css";
import Post from "./Post"; // <Post />
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useParams } from "react-router-dom"; // useParams()

export default function PostModal({ modalState, content }) {
    const { user } = useAuthContext(); // Contains data for logged in user
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL

    window.addEventListener("click", (e) => {
        const classes = [...e.target.classList];
        if (classes.includes("modal")) modalState.setModal(null);
    });

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => modalState.setModal(null)}>&times;</div>
                <Post post={content} canDelete={user && user.username === username} />
            </div>
        </div>
    );
}