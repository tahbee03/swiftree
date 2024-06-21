import "./Login.css"; // Styles for Login page

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { Helmet } from "react-helmet"; // <Helmet>
import { handleError, handlePasswordToggle } from "../utils"; // handleError(), handlePasswordToggle()

export default function Login() {
    const [username, setUsername] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const login = useLogin(); // Custom hook to log in user
    const navigate = useNavigate(); // Needed to redirect to another page

    // Runs on mount
    useEffect(() => {
        // Add event listener to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        // Remove event listener from window when component unmounts
        return () => window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    }, []);

    // Processes login input
    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        setIsLoading(true);

        try {
            setError(null);

            /*
            STEP 1: Validate username

            Criteria:
            - not used by another user -> validated in back-end
            - contains only lowercase letters, numbers, ., and/or _
            - no longer than 20 characters
            */
            const usernamePattern = /^[a-z0-9._]+$/;
            if (!usernamePattern.test(username)) throw new Error("Invalid username characters!");
            if (username.length > 20) throw new Error("Username cannot be longer than 20 characters!");

            /*
            STEP 2: Validate password

            Criteria:
            - contains only keyboard characters
            */
            const passwordPattern = /^[a-zA-Z0-9~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]+$/g;
            if (!passwordPattern.test(password)) throw new Error("Invalid password characters!");

            await login(username, password); // Process input with useLogin hook
            navigate("/"); // Redirect to Home page
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; Login</title>
                <meta name="description" content="Log into Swiftree with an existing account" />
            </Helmet>
            <main id="login-main" className={`${(windowWidth < 768) ? "mini" : ""}`}>
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
                                id="password-input"
                            />
                            <img
                                className="password-toggle"
                                src="/hide.png"
                                alt="password-toggle"
                                onClick={(e) => handlePasswordToggle(e, "password-input")}
                                draggable="false"
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
        </>
    );
}