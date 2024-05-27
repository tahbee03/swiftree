import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { sleep, handleError, handlePasswordToggle } from "../utils"; // sleep(), handleError(), handlePasswordToggle()

export default function PasswordForm() {
    const [oldPassword, setOldPassword] = useState(""); // Stores old password input
    const [newPassword, setNewPassword] = useState(""); // Stores new password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user
    const login = useLogin(); // Custom hook to log in user
    const logout = useLogout(); // Custom hook to log out user

    // Updates user password
    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        setIsLoading(true);
        setError(null);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            /*
            old password criteria:
            - correct authentication

            new password criteria:
            - not the same as old password
            */

            // Verify credentials
            await login(user.username, oldPassword);

            // Checks if new password is the same as current password
            if (newPassword === oldPassword) throw Error("You already have that password!");

            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "PASSWORD",
                    content: {
                        password: newPassword
                    }
                })
            });
            const data = await response.json();

            if (!response.ok) throw Error(data.message);

            logout();
            await sleep(1);
            window.location.href = "/login";
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
                            onClick={(e) => handlePasswordToggle(e, "password-input-1")}
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
                            onClick={(e) => handlePasswordToggle(e, "password-input-2")}
                            id="toggler-2"
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </>
    );
}