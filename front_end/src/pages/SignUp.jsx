import "./SignUp.css"; // Styles for Sign Up page

import { useState } from "react"; // useState()
import { useSignUp } from "../context_and_hooks/useSignUp"; // useSignUp()
import { useNavigate } from "react-router-dom"; // useNavigate()

export default function SignUp() {
    const [email, setEmail] = useState(""); // Stores email input
    const [username, setUsername] = useState(""); // Stores username input
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { signUp, isLoading } = useSignUp(); // Custom hook to create new user
    const navigate = useNavigate(); // Needed to redirect to another page

    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        try {
            await signUp(email, username, displayName, password); // Process input with useSignUp hook
            navigate("/"); // Redirect to Home page
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
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </main>
    );
}