import "./Login.css"; // Styles for Login page

import { useState, useEffect } from "react"; // useState()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useNavigate } from "react-router-dom"; // useNavigate()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Login() {
    const [username, setUsername] = useState(""); // Stores username input
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null);

    const { login } = useLogin(); // Custom hook to log in user
    const navigate = useNavigate(); // Needed to redirect to another page

    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        try {
            setIsLoading(true);
            await login(username, password); // Process input with useLogin hook
            setError(null);
            navigate("/"); // Redirect to Home page
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    function handleToggle(e) {
        // Changes the image for the toggler accordingly
        const toggler = e.target;
        if (toggler.src === `${window.location.origin}/hide.png`) toggler.src = `${window.location.origin}/visible.png`;
        else toggler.src = `${window.location.origin}/hide.png`;

        // Changes the visibility of the password input accordingly
        const passwordInput = document.getElementById("password-input");
        if (passwordInput.type === "password") passwordInput.type = "text";
        else passwordInput.type = "password";
    }

    useEffect(() => {
        const adjustContainer = () => {
            const container = document.getElementById("login-main");

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
                {/* Default meta tags */}
                <title>Swiftree &#8231; Login</title>
                <meta name="description" content="Log into Swiftree with an existing account" />
            </Helmet>
            <main id="login-main">
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
                                onClick={handleToggle}
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