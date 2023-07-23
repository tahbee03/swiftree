import "./SignUp.css"; // Styles for Sign Up page

import { useState } from "react"; // useState()
import { useSignUp } from "../hooks/useSignUp"; // useSignUp()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { useErrorContext } from "../hooks/useErrorContext"; // useErrorContext()

export default function SignUp() {
    const [email, setEmail] = useState(""); // Stores email input
    const [username, setUsername] = useState(""); // Stores username input
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner

    const { signUp } = useSignUp(); // Custom hook to create new user
    const navigate = useNavigate(); // Needed to redirect to another page
    const { error, dispatch } = useErrorContext(); // Stores error from back-end response (if any)

    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        try {
            setIsLoading(true);
            await signUp(email, username, displayName, password); // Process input with useSignUp hook
            dispatch({ type: "RESET" });
            navigate("/"); // Redirect to Home page
        } catch (err) {
            dispatch({ type: "SET", payload: err.message });
            setIsLoading(false);
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

                    <button disabled={isLoading}>
                        {isLoading && (
                            <span className="spinner-border"></span>
                        )}
                        {!isLoading && (
                            <>
                                Sign Up
                            </>
                        )}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </main>
    );
}