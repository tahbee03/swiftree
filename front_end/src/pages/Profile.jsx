import "./Profile.css";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useLogout } from "../context_and_hooks/useLogout";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import PictureForm from "../components/PictureForm";
import Post from "../components/Post";

export default function Profile() {
    const { username } = useParams();
    const { logout } = useLogout();
    const { user, dispatch } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [picture, setPicture] = useState("");
    const [showForm, setShowForm] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await fetch(`/api/users/name-search/${username}`);
                const userData = await userRes.json();

                if (!userRes.ok) throw Error(userData.error);

                setPicture(userData.image.url);

                const postRes = await fetch("/api/posts");
                const postData = await postRes.json();

                if (postRes.ok) setPosts(postData.filter((post) => post.author === username));
                else throw Error(postData.error);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();

    }, [username, error, picture]);

    async function handlePictureRemoval() {
        setIsLoading(true);

        const users = await (await fetch("/api/users")).json();
        const match = users.filter((u) => u.username === user.username);

        const userRes = await fetch(`/api/users/${match[0]._id}`, {
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

        if (!userRes.ok) console.log(userData.error);
        else {
            console.log("User updated!");

            const payload = {
                username: user.username,
                pfp: "",
                posts: user.posts,
                token: user.token
            };
            dispatch({ type: "UPDATE", payload });
            sessionStorage.setItem("user", JSON.stringify(payload));
            console.log(sessionStorage.getItem("user"));

        }

        setIsLoading(false);
        window.location.reload();
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <Navbar />
            <div className="container" id="profile-cont">
                {error && (
                    <div>{error}</div>
                )}
                {!error && (
                    <div className="row">
                        <div className="col-3" id="info-col">
                            {(picture === "") && (
                                <img src="/account_icon.png" alt="account pic" />
                            )}
                            {!(picture === "") && (
                                <img src={picture} alt="account pic" />
                            )}
                            <p><b>{username}</b></p>
                            <p>{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
                            {user && (user.username === username) && (
                                <>
                                    <button type="button" onClick={() => setShowForm("post-form")}>Make New Post</button>
                                    <button type="button" onClick={() => setShowForm("pfp-form")}>Change Profile Picture</button>
                                    {!(picture === "") && (
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
                                    {showForm && (
                                        <>
                                            <hr />
                                            {(showForm === "post-form") && (
                                                <PostForm />
                                            )}
                                            {(showForm === "pfp-form") && (
                                                <PictureForm />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="col-8" id="posts-col">
                            {(posts.length === 0) && (
                                <p>This user has no posts!</p>
                            )}
                            {!(posts.length === 0) && posts.map((post) => (
                                <Post key={post._id} post={post} canDelete={user && (user.username === username)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}