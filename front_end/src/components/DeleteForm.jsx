import { useEffect, useState } from "react"; // useState(), useEffect()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogin } from "../hooks/useLogin"; // useLogin()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { sleep, handleError, handlePasswordToggle } from "../utils"; // sleep(), handleError(), handlePasswordToggle()

export default function DeleteForm() {
    const [loadingMsg, setLoadingMsg] = useState(""); // Loading message to show the steps of every process
    const [option, setOption] = useState(""); // Stores selected option
    const [password, setPassword] = useState(""); // Stores password input
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user
    const login = useLogin(); // Custom hook to log in user
    const logout = useLogout(); // Custom hook to log out user

    // Runs when the value of isLoading is changed
    useEffect(() => {
        const modal = document.querySelector(".modal");

        if (isLoading) modal.style.backgroundColor = "rgba(0,0,0)";
        else modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    }, [isLoading]);

    // Deletes user data
    async function handleSubmit(e) {
        e.preventDefault(); // No reload on submit

        setIsLoading(true);
        setError(null);

        try {
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "none"; // Disable mouse

            // STEP 1: Check if entered password is correct
            await login(user.username, password);

            setLoadingMsg("Preparing...");
            await sleep(3);

            // STEP 2: Gather and delete all posts made by user
            setLoadingMsg("Fetching post data...");

            const postGetResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const postGetData = await postGetResponse.json();

            if (!postGetResponse.ok) throw new Error(postGetData.message);

            const posts = postGetData.filter((p) => p.author_id === user.id);
            await sleep(3);

            setLoadingMsg("Deleting posts...");

            for (let post of posts) {
                const postDeleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, { method: "DELETE" });
                const postDeleteData = await postDeleteResponse.json();

                if (!postDeleteResponse.ok) throw new Error(postDeleteData.message);
            }

            await sleep(3);

            // STEP 3: Remove profile picture from cloud (if any)
            if (user.pfp !== "/account_icon.png") {
                setLoadingMsg("Removing profile picture from cloud...");

                const userGetResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`);
                const userGetData = await userGetResponse.json();

                if (!userGetResponse.ok) throw new Error(userGetData.message);

                const userUpdateResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        mode: "IMAGE",
                        content: {
                            selectedFile: "",
                            public_id: userGetData.image.public_id
                        }
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                const userUpdateData = await userUpdateResponse.json();

                if (!userUpdateResponse.ok) throw new Error(userUpdateData.message);

                await sleep(3);
            }

            // STEP 4: Delete user data
            setLoadingMsg("Deleting user...");

            logout(); // Remove user data from browser and context

            const userDeleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, { method: "DELETE" });
            const userDeleteData = await userDeleteResponse.json();

            if (!userDeleteResponse.ok) throw new Error(userDeleteData.error);

            await sleep(3);

            setLoadingMsg("Wrapping up...");
            await sleep(3);

            window.location.href = "/";
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
            for (let element of document.querySelectorAll("*")) element.style.pointerEvents = "auto"; // Enable mouse
        }
    }

    return (
        <>
            {error && (
                <div className="error-msg">{error}</div>
            )}
            {isLoading && (
                <>
                    <p>{loadingMsg}</p>
                    <span className="spinner-border"></span>
                </>
            )}
            {!error && !isLoading && (
                <>
                    <div className="form-item">
                        <p style={{ color: "red" }}>Are you sure? This action is irreversible!</p>
                        <button className={(option === "yes") ? "active-button" : ""} onClick={() => setOption("yes")}>Yes</button>
                        <button className={(option === "no") ? "active-button" : ""} onClick={() => setOption("no")}>No</button>
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
                                    onClick={(e) => handlePasswordToggle(e, "password-input")}
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