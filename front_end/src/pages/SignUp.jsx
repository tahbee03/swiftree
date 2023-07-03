import "./SignUp.css";
import { useState } from "react";
import { useSignUp } from "../context_and_hooks/useSignUp";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { signUp, isLoading } = useSignUp();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // console.log(`${email} | ${username} | ${password}`);
        try {
            await signUp(email, username, displayName, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="sign-up-main">
            <div>
                <a href="/">
                    <h1>swiftree</h1>
                </a>
                <h2>Sign Up</h2>
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-item">
                        <p>Email</p>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                    </div>

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
                        <p>Display Name</p>
                        <input
                            type="text"
                            name="display_name"
                            required
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName} />
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

                    <button disabled={isLoading}>Sign Up</button>
                    {error && <div>{error}</div>}
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </main>
    );
}