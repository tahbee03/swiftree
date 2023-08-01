import "./UsernameForm.css";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function UsernameForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [error, setError] = useState(null);

    const { user, dispatch } = useAuthContext(); // Contains data for logged in user
    const { login } = useLogin();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            console.log(`${username}, ${password}`);

            /*
            username criteria:
            - doesn't already exist
            - contains only lowercase letters, numbers, ., and/or _

            password criteria:
            - matches the one for the currently logged in user
            */

            const pattern = /^[a-zA-Z0-9._]+$/;

            // Username contains invalid characters
            if (!pattern.test(username)) throw Error("Invalid characters!");

            // New username is the same as the current username
            if (user.username === username) throw Error("You already have that username!");

            const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const usersData = await usersRes.json();

            // Error with back-end
            if (!usersRes.ok) throw Error(usersData.error);

            const existingMatch = usersData.filter((u) => u.username === username);

            // Username already exists
            if (!(existingMatch.length === 0)) throw Error("That username already exists!");

            await login(user.username, password);

            const match = usersData.filter((u) => u.username === user.username)[0];

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "USERNAME",
                    content: {
                        username
                    }
                })
            });
            const userData = await userRes.json();

            // Error with back-end
            if (!userRes.ok) throw Error(userData.error);

            // Updates logged in user in AuthContext
            const payload = {
                username,
                display_name: user.display_name,
                pfp: user.pfp,
                posts: user.posts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });

            // Updates logged in user in browser storage
            sessionStorage.setItem("user", JSON.stringify(payload));

            navigate(`/profile/${username}`);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            {error && <div className="error-msg">{error}</div>}
            {!error && isLoading && (
                <span className="spinner-border"></span>
            )}
            {!error && !isLoading && (
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
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            )}
        </>
    );
}