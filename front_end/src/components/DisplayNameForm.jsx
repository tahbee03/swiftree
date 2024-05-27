import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { sleep, handleError, handlePasswordToggle } from "../utils"; // sleep(), handleError(), handlePasswordToggle()

export default function DisplayNameForm() {
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user
    const login = useLogin(); // Custom hook to log in user

    // Updates user display name
    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        setIsLoading(true);
        setError(null);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            /*
            display name criteria:
            - not the same as current display name

            password criteria:
            - matches the one for the currently logged in user
            */

            // New display is the same as the current username
            if (displayName === user.display_name) throw new Error("You already have that display name!");

            // Verify credentials
            await login(user.username, password);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "DISPLAY-NAME",
                    content: {
                        display_name: displayName
                    }
                })
            });
            const data = await response.json();

            if (!response.ok) throw Error(data.message);

            sessionStorage.setItem("user", JSON.stringify({
                ...user,
                display_name: displayName
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
                <form onSubmit={handleSubmit}>
                    <div className="form-item">
                        <p>New Display Name</p>
                        <input
                            type="text"
                            name="display-name"
                            required
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName}
                        />
                    </div>
                    <div className="form-item">
                        <p>Current Password</p>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password-input"
                        />
                        <img
                            className="password-toggle"
                            src="/hide.png"
                            alt="password-toggle"
                            onClick={(e) => handlePasswordToggle(e, "password-input")}
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </>
    );
}