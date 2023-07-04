import "./Login.css";
import { useState } from "react";
import { useLogin } from "../context_and_hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login, isLoading } = useLogin();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // console.log(`${username} | ${password}`);
        try {
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
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

                    <button disabled={isLoading}>Login</button>
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <p>
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </p>
            </div>
        </main>
    );
}