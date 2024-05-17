import "./EmailForm.css";
import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useNavigate } from "react-router-dom"; // useNavigate()

export default function EmailForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [error, setError] = useState(null);

    const { user } = useAuthContext(); // Contains data for logged in user
    const { login } = useLogin();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none";

            /*
            email criteria:
            - not the same as current email
            - in the format a@b.c

            password criteria:
            - matches the one for the currently logged in user
            */

            const pattern = /^.+@.+\..+$/;

            // Email is not in the correct format
            if (!pattern.test(email)) throw Error("Invalid email!");

            // Fetches all users
            const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const usersData = await usersRes.json();

            // Error with back-end
            if (!usersRes.ok) throw Error(usersData.error);

            const match = usersData.filter((u) => u.username === user.username)[0];

            // New email is the same as the current email
            if (email === match.email) throw Error("You already have that email!");

            await login(user.username, password);

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "EMAIL",
                    content: {
                        email
                    }
                })
            });
            const userData = await userRes.json();

            // Error with back-end
            if (!userRes.ok) throw Error(userData.error);

            navigate(`/profile/${user.username}`);
            window.location.reload();
        } catch (err) {
            setError(err.message);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto";
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
                        <p>New Email</p>
                        <input
                            type="text"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
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