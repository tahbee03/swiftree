import "./Profile.css"; // Styles for Profile page

import PostForm from "../components/PostForm"; // <PostForm />
import PictureForm from "../components/PictureForm"; // <PictureForm />
import Post from "../components/Post"; // <Post />
import Navbar from "../components/Navbar"; // <Navbar />

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useNavigate, useParams } from "react-router-dom"; // useNavigate(), useParams()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { useErrorContext } from "../hooks/useErrorContext"; // useErrorContext()
import PostTree from "../components/PostTree";

export default function Profile() {
    const [presentedUser, setPresentedUser] = useState({
        displayName: "",
        pfp: "/account_icon.png"
    }); // Contains data for the user presented on the page
    const [posts, setPosts] = useState([]); // Contains posts to be displayed in the posts container
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner

    const navigate = useNavigate(); // Needed to redirect to another page
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL
    const { logout } = useLogout(); // Custom hook to log out logged in user
    const { user, dispatch: authDispatch } = useAuthContext(); // Contains data for logged in user
    const { error, dispatch: errorDispatch } = useErrorContext(); // Stores error from back-end response (if any)

    useEffect(() => {
        const adjust = () => {
            const infoCol = document.getElementById("info-col");
            const profileCont = document.getElementById("profile-cont");

            if (window.innerWidth < 768) {
                infoCol.style.backgroundColor = "rgba(255, 255, 255, 0)";
                infoCol.style.height = "fit-content";

                profileCont.style.marginTop = "0";
            } else {
                infoCol.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                infoCol.style.height = "100%";

                profileCont.style.marginTop = "5vh";
            }
        };

        adjust();

        window.addEventListener("resize", adjust);

        return () => {
            window.removeEventListener("resize", adjust);
        };
    }, []);

    // Runs when username value is updated
    useEffect(() => {
        const fetchUser = async () => {
            // Gets all users from back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const userData = await userRes.json();

            if (!userRes.ok) throw Error(userData.error);

            // Filters users to match the one in the URL
            const match = userData.filter((u) => u.username === username);

            if (match.length === 0) throw Error(`The user '${username}' does not exist!`);

            // Updates the presented user's information
            setPresentedUser({
                displayName: match[0].display_name,
                pfp: match[0].image.url
            });

            // Gets all posts from back-end
            const postRes = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const postData = await postRes.json();

            if (!postRes.ok) throw Error(postData.error);

            // Filters posts to match the one in the URL and updates the posts to be shown
            setPosts(postData.filter((post) => post.author === username));
        };

        try {
            fetchUser();
            errorDispatch({ type: "RESET" });
        } catch (err) {
            errorDispatch({ type: "SET", payload: err.message });
        }
    }, [username]);

    // Removes user's picture from cloud and sets it to default
    async function handlePictureRemoval() {
        try {
            setIsLoading(true);

            // Gets all users from back-end
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users`);
            const data = await res.json();

            if (!res.ok) throw Error(data.error);

            // Filters users to match the one logged in
            const match = data.filter((u) => u.username === user.username);

            // Updates logged in user in back-end
            const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${match[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    mode: "IMAGE",
                    content: {
                        selectedFile: "",
                        public_id: match[0].image.public_id
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });
            const userData = await userRes.json();

            if (!userRes.ok) throw Error(userData.error);

            // Updates logged in user in AuthContext
            const payload = {
                username: user.username,
                display_name: user.display_name,
                pfp: "/account_icon.png",
                posts: user.posts,
                token: user.token
            };
            authDispatch({ type: "UPDATE", payload });

            // Updates logged in user in browser storage
            sessionStorage.setItem("user", JSON.stringify(payload));

            setIsLoading(false);
            errorDispatch({ type: "RESET" });
            window.location.reload(); // Reloads page
        } catch (err) {
            errorDispatch({ type: "SET", payload: err.message });
        }
    }

    // Logs out logged in user
    function handleLogout() {
        try {
            setIsLoading(true);
            logout();
            errorDispatch({ type: "RESET" });
            navigate("/login"); // Redirect to Login page
        } catch (err) {
            errorDispatch({ type: "SET", payload: err.message });
            setIsLoading(false);
        }
    }

    // Opens modal to show active form
    function openModal(id) {
        const m = document.getElementById(id);
        m.style.display = "block";
        m.style.zIndex = "1";
    }

    // Closes modal containing active form
    function closeModal(id) {
        const m = document.getElementById(id);
        m.style.display = "none";
        m.style.zIndex = "-1";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", (e) => {
        if (e.target.id === "post-form-modal" || e.target.id === "picture-form-modal") closeModal(e.target.id);
    });

    return (
        <>
            <Navbar />
            <div className="container" id="profile-cont">
                <div id="post-form-modal">
                    <PostForm closeFunc={closeModal} />
                </div>
                <div id="picture-form-modal">
                    <PictureForm closeFunc={closeModal} />
                </div>
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {!error && (
                    <div className="row">
                        <div className="col-md-3 col-12" id="info-col">
                            <img src={presentedUser.pfp} alt="account pic" />
                            <p><b>{presentedUser.displayName}</b> &#183; {username}</p>
                            <p>{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
                            {user && (user.username === username) && (
                                <>
                                    <button type="button" onClick={() => openModal("post-form-modal")}>Make New Post</button>
                                    <button type="button" onClick={() => openModal("picture-form-modal")}>Change Profile Picture</button>
                                    {!(presentedUser.pfp === "/account_icon.png") && (
                                        <button
                                            type="button"
                                            onClick={handlePictureRemoval}
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <span className="spinner-border"></span>
                                            )}
                                            {!isLoading && (
                                                <>
                                                    Remove Profile Picture
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <button type="button" onClick={handleLogout}>Log Out</button>
                                </>
                            )}
                        </div>
                        <div className="col-md-8 col-12" id="posts-col">
                            {(posts.length === 0) && (
                                <p>This user has no posts!</p>
                            )}
                            {!(posts.length === 0) && (
                                <PostTree posts={posts} page={"profile"} />
                            )}
                            {/* {!(posts.length === 0) && posts.map((post) => (
                                <Post key={post._id} post={post} canDelete={user && (user.username === username)} />
                            ))} */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// TODO: Modify so that users are able to update their username and display name