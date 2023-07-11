import "./PictureForm.css";
import { useState } from "react";
import { useAuthContext } from "../context_and_hooks/AuthContext";
// require("dotenv").config();

export default function PictureForm({ closeFunc }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const { user, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    // Convert image to base64
    // TODO: Try to understand later
    function processImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setSelectedFile(reader.result);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const users = await (await fetch(`${process.env.REACT_APP_API_URL}/users`)).json();
        const match = users.filter((u) => u.username === user.username);
        let userRes = null;

        if (match[0].image.public_id === "") { // No existing image for the user
            userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile,
                        public_id: ""
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
        } else { // An image for the user already exists
            userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile,
                        public_id: match[0].image.public_id
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
        }

        const userData = await userRes.json();
        // console.log(userData);

        if (!userRes.ok) console.log(userData.error);
        else {
            const u = await (await fetch(`${process.env.REACT_APP_API_URL}/users/id-search/${match[0]._id}`)).json();
            console.log("User updated!");

            const payload = {
                username: user.username,
                display_name: user.display_name,
                pfp: u.image.url,
                posts: user.posts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
            console.log(sessionStorage.getItem("user"));
        }

        setIsLoading(false);
        window.location.reload();
    }

    return (
        <div className="modal-content">
            <div className="close" onClick={() => closeFunc("picture-form-modal")}>&times;</div>
            <form className="pfp-form" onSubmit={handleSubmit}>
                <h3>New Profile Picture</h3>

                <input type="file" onChange={processImage} />
                <button type="submit" disabled={isLoading}>
                    {isLoading && (
                        <span className="spinner-border"></span>
                    )}
                    {!isLoading && (
                        <>
                            Upload Picture
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

// TODO: Create a modal structure for the form