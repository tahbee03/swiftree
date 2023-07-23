import "./Login.css"; // Styles for Login page

import { useState } from "react"; // useState()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { useErrorContext } from "../hooks/useErrorContext"; // useErrorContext()

export default function Login() {
    const [username, setUsername] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner

    const { login } = useLogin(); // Custom hook to log in user
    const navigate = useNavigate(); // Needed to redirect to another page
    const { error, dispatch } = useErrorContext(); // Stores error from back-end response (if any)

    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        try {
            setIsLoading(true);
            await login(username, password); // Process input with useLogin hook
            dispatch({ type: "RESET" });
            navigate("/"); // Redirect to Home page
        } catch (err) {
            dispatch({ type: "SET", payload: err.message });
            setIsLoading(false);
        }
    }

    return (
        <main className="login-main">
            <div>
                <a href="/">
                    <h1>swiftree</h1>
                </a>
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-item">
                        <p>Username</p>
                        <input
                            type="text"
                            name="username"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>

                    <div className="form-item">
                        <p>Password</p>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button disabled={isLoading}>
                        {isLoading && (
                            <span className="spinner-border"></span>
                        )}
                        {!isLoading && (
                            <>
                                Login
                            </>
                        )}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <p>
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </p>
            </div>
        </main>
    );
}