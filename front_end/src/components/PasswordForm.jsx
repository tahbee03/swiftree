import "./PasswordForm.css";
import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { useNavigate } from "react-router-dom"; // useNavigate()

export default function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState(""); // Stores old password input
    const [newPassword, setNewPassword] = useState(""); // Stores new password input
    const [error, setError] = useState(null);

    const { user, dispatch } = useAuthContext(); // Contains data for logged in user
    const { login } = useLogin();
    const { logout } = useLogout();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            console.log(`${oldPassword}, ${newPassword}`);

            /*
            old password criteria:
            - contains only lowercase letters, numbers, ., and/or _
            - correct authentication

            new password criteria:
            - contains only lowercase letters, numbers, ., and/or _
            - not the same as old password
            */

            const pattern = /^[a-zA-Z0-9._]+$/;

            // Old password contains invalid characters
            if (!pattern.test(oldPassword)) throw Error("Invalid characters in your current password!");

            // New password contains invalid characters
            if (!pattern.test(newPassword)) throw Error("Invalid characters in your new password!");

            // Checks if old password is correct
            await login(user.username, oldPassword);

            // Checks if new password is the same as current password
            if (newPassword === oldPassword) throw Error("You already have that password!");

            const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const usersData = await usersRes.json();

            // Error with back-end
            if (!usersRes.ok) throw Error(usersData.error);

            const match = usersData.filter((u) => u.username === user.username)[0];

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "PASSWORD",
                    content: {
                        password: newPassword
                    }
                })
            });
            const userData = await userRes.json();

            // Error with back-end
            if (!userRes.ok) throw Error(userData.error);

            // Logs the user out
            logout();
            navigate(`/login`);
        } catch (err) {
            setError(err.message);
        }
    }

    function handleToggle(e) {
        // Changes the image for the toggler accordingly
        const toggler = e.target;
        if (toggler.src === `${window.location.origin}/hide.png`) toggler.src = `${window.location.origin}/visible.png`;
        else toggler.src = `${window.location.origin}/hide.png`;

        let passwordInput = null;

        // Changes the visibility of the password input accordingly
        if (toggler.id === "toggler-1") {
            passwordInput = document.getElementById("password-input-1");
            if (passwordInput.type === "password") passwordInput.type = "text";
            else passwordInput.type = "password";
        }
        else {
            passwordInput = document.getElementById("password-input-2");
            if (passwordInput.type === "password") passwordInput.type = "text";
            else passwordInput.type = "password";
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
                        <p>Current Password</p>
                        <input
                            type="password"
                            name="old-username"
                            required
                            onChange={(e) => setOldPassword(e.target.value)}
                            value={oldPassword}
                            id="password-input-1"
                        />
                        <img
                            className="password-toggle"
                            src="/hide.png"
                            alt="password-toggle"
                            onClick={handleToggle}
                            id="toggler-1"
                        />
                    </div>

                    <div className="form-item">
                        <p>New Password</p>
                        <input
                            type="password"
                            name="new-password"
                            required
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            id="password-input-2"
                        />
                        <img
                            className="password-toggle"
                            src="/hide.png"
                            alt="password-toggle"
                            onClick={handleToggle}
                            id="toggler-2"
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            )}
        </>
    );

}