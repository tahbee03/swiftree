import "./PictureForm.css";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useErrorContext } from "../hooks/useErrorContext"; // useErrorContext()

export default function PictureForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { user, dispatch: authDispatch } = useAuthContext(); // Contains data for logged in user
    const { error, dispatch: errorDispatch } = useErrorContext(); // Stores error from back-end response (if any)

    // Converts image to base64
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
            authDispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
            console.log(sessionStorage.getItem("user"));
        }

        // setIsLoading(false);
        window.location.reload();
    }

    // Removes user's picture from cloud and sets it to default
    async function handlePictureRemoval() {
        try {
            setIsLoading(true);

            // Gets all users from back-end
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const data = await res.json();

            if (!res.ok) throw Error(data.error);

            // Filters users to match the one logged in
            const match = data.filter((u) => u.username === user.username);

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile: "",
                        public_id: match[0].image.public_id
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
            const userData = await userRes.json();

            if (!userRes.ok) throw Error(userData.error);

            // Updates logged in user in AuthContext
            const payload = {
                username: user.username,
                display_name: user.display_name,
                pfp: "/account_icon.png",
                posts: user.posts,
                token: user.token
            };
            authDispatch({ type: "UPDATE", payload });

            // Updates logged in user in browser storage
            sessionStorage.setItem("user", JSON.stringify(payload));

            // setIsLoading(false);
            errorDispatch({ type: "RESET" });
            window.location.reload(); // Reloads page
        } catch (err) {
            errorDispatch({ type: "SET", payload: err.message });
        }
    }

    return (
        <>
            {error && (
                <div className="error-msg">{error}</div>
            )}
            {isLoading && (
                <span className="spinner-border"></span>
            )}
            {!isLoading && (
                <>
                    <form className="pfp-form" onSubmit={handleSubmit}>
                        <input
                            type="file"
                            onChange={processImage}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                        >
                            Submit Picture
                        </button>
                    </form>
                    {!(user.pfp === "/account_icon.png") && (
                        <>
                            <hr />
                            <button
                                onClick={handlePictureRemoval}
                                disabled={(isLoading || selectedFile)}
                            >
                                Remove Profile Picture
                            </button>
                        </>
                    )}
                </>
            )}
        </>
    );
}