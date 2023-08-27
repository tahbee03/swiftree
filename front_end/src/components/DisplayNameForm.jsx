import "./DisplayNameForm.css";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin";

export default function DisplayNameForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [error, setError] = useState(null);

    const { user, dispatch } = useAuthContext(); // Contains data for logged in user
    const { login } = useLogin();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            console.log(`${displayName}, ${password}`);

            /*
            password criteria:
            - matches the one for the currently logged in user
            */

            const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const usersData = await usersRes.json();

            // Error with back-end
            if (!usersRes.ok) throw Error(usersData.error);

            await login(user.username, password);
            const match = usersData.filter((u) => u.username === user.username)[0];

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "DISPLAY-NAME",
                    content: {
                        display_name: displayName
                    }
                })
            });
            const userData = await userRes.json();

            // Error with back-end
            if (!userRes.ok) throw Error(userData.error);

            // Updates logged in user in AuthContext
            const payload = {
                username: user.username,
                display_name: displayName,
                pfp: user.pfp,
                posts: user.posts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });

            // Updates logged in user in browser storage
            sessionStorage.setItem("user", JSON.stringify(payload));

            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    }

    function handleToggle(e) {
        // Changes the image for the toggler accordingly
        const toggler = e.target;
        if (toggler.src === `${window.location.origin}/hide.png`) toggler.src = `${window.location.origin}/visible.png`;
        else toggler.src = `${window.location.origin}/hide.png`;

        // Changes the visibility of the password input accordingly
        const passwordInput = document.getElementById("password-input");
        if (passwordInput.type === "password") passwordInput.type = "text";
        else passwordInput.type = "password";
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
                            onClick={handleToggle}
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            )}
        </>
    );
}