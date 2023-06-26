import "./PictureForm.css";
import { useState } from "react";
import { useAuthContext } from "../context_and_hooks/AuthContext";

export default function PictureForm() {
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

        const users = await (await fetch("/api/users")).json();
        const match = users.filter((u) => u.username === user.username);
        console.log(match[0]);

        const userRes = await fetch(`/api/users/${match[0]._id}`, {
            method: "PATCH",
            body: JSON.stringify({ image: selectedFile }),
            headers: { "Content-Type": "application/json" }
        });
        const userData = await userRes.json();
        // console.log(userData);

        if (!userRes.ok) console.log(userData.error);
        else {
            const u = await (await fetch(`/api/users/id-search/${match[0]._id}`)).json();
            console.log("User updated!");

            const payload = {
                username: user.username,
                pfp: u.image.url,
                posts: user.posts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
            console.log(sessionStorage.getItem("user"));
            setIsLoading(false);

        }

        if (!isLoading) window.location.reload();
    }

    return (
        <form className="pfp-form" onSubmit={handleSubmit}>
            <h3>New Profile Picture</h3>

            <input type="file" onChange={processImage} />
            <button type="submit" disabled={isLoading}>Upload Picture</button>
        </form>
    );
}