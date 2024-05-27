import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { sleep, handleError, handlePasswordToggle } from "../utils"; // sleep(), handleError(), handlePasswordToggle()

export default function UsernameForm() {
    const [username, setUsername] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user
    const login = useLogin(); // Custom hook to log in user

    // Updates user username
    async function handleSubmit(e) {
        e.preventDefault(); // No refresh on submit

        setIsLoading(true);
        setError(null);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            /*
            username criteria:
            - not the same as current username
            - not used by another user
            - contains only lowercase letters, numbers, ., and/or _

            password criteria:
            - matches the one for the currently logged in user
            */

            const pattern = /^[a-zA-Z0-9._]+$/;

            // Username contains invalid characters
            if (!pattern.test(username)) throw new Error("Invalid characters!");

            // New username is the same as the current username
            if (username === user.username) throw new Error("You already have that username!");

            const matchResponse = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const matchData = await matchResponse.json();

            if (!matchResponse.ok) throw new Error(matchData.message);

            // Username already exists
            if (matchData.filter((u) => u.username === username).length !== 0) throw new Error("That username already exists!");

            // Verify credentials
            await login(user.username, password);

            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "USERNAME",
                    content: {
                        username
                    }
                })
            });
            const userData = await userResponse.json();

            if (!userResponse.ok) throw new Error(userData.message);

            sessionStorage.setItem("user", JSON.stringify({
                ...user,
                username
            }));
            await sleep(1);
            window.location.href = `/profile/${username}`;
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
                        <p>New Username</p>
                        <input
                            type="text"
                            name="username"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
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