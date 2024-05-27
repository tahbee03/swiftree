import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { sleep, handleError } from "../utils"; // sleep(), handleError()

export default function PictureForm() {
    const [selectedFile, setSelectedFile] = useState(null); // Contains selected image
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user

    // Converts image to base64
    function processImage(e) {
        try {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setSelectedFile(reader.result);
            }
        } catch (error) {
            setError(handleError(error));
        }
    }

    // Adds or replaces user profile picture
    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        setIsLoading(true);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            // FETCH 1: Get user data, since the image public ID is not sent to the front-end
            const response1 = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`);
            const data1 = await response1.json();

            if (!response1.ok) throw new Error(data1.message);

            // FETCH 2: Update user data with new profile picture
            const response2 = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile,
                        public_id: (user.pfp === "/account_icon.png") ? "" : data1.image.public_id
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
            const data2 = await response2.json();

            if (!response2.ok) throw new Error(data2.message);

            sessionStorage.setItem("user", JSON.stringify({
                ...user,
                pfp: data2.image.url
            }));
            await sleep(1);
            window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto"; // Enable mouse
        }
    }

    // Removes user profile picture
    async function handlePictureRemoval() {
        setIsLoading(true);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            // FETCH 1: Get user data for back-end, since the image public ID is not sent to the front-end
            const response1 = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`);
            const data1 = await response1.json();

            if (!response1.ok) throw new Error(data1.message);

            // FETCH 2: Update user data to have default profile picture
            const response2 = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile: "",
                        public_id: data1.image.public_id
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
            const data2 = await response2.json();

            if (!response2.ok) throw new Error(data2.message);

            sessionStorage.setItem("user", JSON.stringify({
                id: user.id,
                email: user.email,
                username: user.username,
                display_name: user.display_name,
                pfp: "/account_icon.png",
                token: user.token
            }));
            await sleep(1);
            window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto"; // Enable mouse
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
                    <form className="pfp-form" onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <input
                            type="file"
                            onChange={processImage}
                            accept="image/*"
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