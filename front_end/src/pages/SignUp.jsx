import "./SignUp.css"; // Styles for Sign Up page

import { useState, useEffect } from "react"; // useState()
import { useSignUp } from "../hooks/useSignUp"; // useSignUp()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { Helmet } from "react-helmet"; // <Helmet>

export default function SignUp() {
    const [email, setEmail] = useState(""); // Stores email input
    const [username, setUsername] = useState(""); // Stores username input
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null);

    const { signUp } = useSignUp(); // Custom hook to create new user
    const navigate = useNavigate(); // Needed to redirect to another page

    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        try {
            setIsLoading(true);
            await signUp(email, username, displayName, password); // Process input with useSignUp hook
            setError(null);
            navigate("/"); // Redirect to Home page
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const adjustContainer = () => {
            const container = document.getElementById("sign-up-main");

            if (window.innerWidth < 576) container.style.width = "90vw";
            else container.style.width = "60vw";
        };

        adjustContainer();

        window.addEventListener("resize", adjustContainer);

        return () => {
            window.removeEventListener("resize", adjustContainer);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>Swiftree &#8231; Sign Up</title>
                <meta name="description" content="Sign up for a new Swiftree account" />
            </Helmet>
            <main id="sign-up-main">
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
        </>
    );
}