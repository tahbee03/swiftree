import "./SignUp.css"; // Styles for Sign Up page

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useSignUp } from "../hooks/useSignUp"; // useSignUp()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { Helmet } from "react-helmet"; // <Helmet>
import { handleError, handlePasswordToggle } from "../utils"; // handleError(), handlePasswordToggle()

export default function SignUp() {
    const [email, setEmail] = useState(""); // Stores email input
    const [username, setUsername] = useState(""); // Stores username input
    const [displayName, setDisplayName] = useState(""); // Stores display name input
    const [password, setPassword] = useState(""); // Stores password input
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const signUp = useSignUp(); // Custom hook to create new user
    const navigate = useNavigate(); // Needed to redirect to another page

    // Runs on mount
    useEffect(() => {
        // Add event listener to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        // Remove event listener from window when component unmounts
        return () => window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    }, []);

    // Processes sign up input
    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        setIsLoading(true);

        try {
            setError(null);

            /*
            STEP 1: Validate email

            Criteria:
            - not used by another user -> validated in back-end
            - in the format a@b.c
            */
            const emailPattern = /^.+@.+\..+$/;
            if (!emailPattern.test(email)) throw new Error("Invalid email format!");

            /*
            STEP 2: Validate username

            Criteria:
            - not used by another user -> validated in back-end
            - contains only lowercase letters, numbers, ., and/or _
            - no longer than 20 characters
            */
            const usernamePattern = /^[a-z0-9._]+$/;
            if (!usernamePattern.test(username)) throw new Error("Invalid username characters!");
            if (username.length > 20) throw new Error("Username cannot be longer than 20 characters!");

            /*
            STEP 3: Validate display name

            Criteria:
            - no longer than 20 characters
            */
            if (displayName.length > 20) throw new Error("Display name cannot be longer than 20 characters!");

            /*
            STEP 4: Validate password

            Criteria:
            - contains only keyboard characters
            */
            const passwordPattern = /^[a-zA-Z0-9~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]+$/g;
            if (!passwordPattern.test(password)) throw new Error("Invalid password characters!");

            await signUp(email, username, displayName, password); // Process input with useSignUp hook
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
                <title>Swiftree &#8231; Sign Up</title>
                <meta name="description" content="Sign up for a new Swiftree account" />
            </Helmet>
            <main id="sign-up-main" className={`${(windowWidth < 768) ? "mini" : ""}`}>
                <div>
                    <a href="/">
                        <h1>swiftree</h1>
                    </a>
                    <h2>Sign Up</h2>
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <div className="form-item">
                            <p>Email</p>
                            <input
                                type="text"
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