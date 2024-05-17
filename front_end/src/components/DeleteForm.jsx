import "./DeleteForm.css";
import { useState } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { useNavigate } from "react-router-dom"; // useNavigate()

export default function DeleteForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [option, setOption] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { user } = useAuthContext(); // Contains data for logged in user
    const { login } = useLogin();
    const { logout } = useLogout();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Checks if the password is correct
            await login(user.username, password);

            setIsLoading(true);
            setLoadingMsg("Preparing...");
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none";

            setTimeout(async () => {
                try {
                    setLoadingMsg("Fetching user data...");

                    // Fetches all users
                    const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                    const usersData = await usersRes.json();

                    // Error with back-end
                    if (!usersRes.ok) throw Error(usersData.error);

                    const match = usersData.filter((u) => u.username === user.username)[0];

                    setLoadingMsg("Fetching post data...");

                    // Fetches all posts
                    const postsRes = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                    const postsData = await postsRes.json();

                    // Error with back-end
                    if (!postsRes.ok) throw Error(postsData.error);

                    const matchPosts = postsData.filter((p) => p.author_id === match._id);

                    setLoadingMsg("Deleting posts...");

                    for (let post of matchPosts) {
                        try {
                            // Deletes post
                            const delPostRes = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, { method: "DELETE" });
                            const delPostData = await delPostRes.json();

                            // Error eith back-end
                            if (!delPostRes.ok) throw Error(delPostData.error);
                        } catch (err) {
                            setError(err.message);
                        }
                    }

                    setLoadingMsg("Deleting user...");

                    // Removes user data from browser and AuthContext
                    logout();

                    // Deletes user
                    const delUserRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match._id}`, { method: "DELETE" });
                    const delUserData = await delUserRes.json();

                    // Error eith back-end
                    if (!delUserRes.ok) throw Error(delUserData.error);

                    setLoadingMsg("Wrapping up...");

                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } catch (err) {
                    setError(err.message);
                    for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto";
                }
            }, 3000);
        } catch (err) {
            setError(err.message);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto";
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

    return (
        <>
            {error && <div className="error-msg">{error}</div>}
            {!error && isLoading && (
                <>
                    <p>{loadingMsg}</p>
                    <span className="spinner-border"></span>
                </>
            )}
            {!error && !isLoading && (
                <>
                    <div className="form-item">
                        <p className="warning">Are you sure? This action is irreversible!</p>
                        <button onClick={() => setOption("yes")}>Yes</button>
                        <button onClick={() => setOption("no")}>No</button>
                    </div>
                    {(option === "yes") && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-item">
                                <p>Please enter your password to finalize your decision.</p>
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

                            <button type="submit">Submit</button>
                        </form>
                    )}
                    {(option === "no") && (
                        <p>Thanks for staying with Swiftree!</p>
                    )}
                </>
            )}
        </>
    );
}