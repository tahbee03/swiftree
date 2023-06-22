import "./Profile.css";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useLogout } from "../context_and_hooks/useLogout";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import Post from "../components/Post";

export default function Profile() {
    const { username } = useParams();
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await fetch(`/api/users/name-search/${username}`);
                const userData = await userRes.json();

                if (!userRes.ok) throw Error(userData.error);
                // console.log(`error: ${error}`);

                const postRes = await fetch("/api/posts");
                const postData = await postRes.json();

                console.log(postData);

                if (postRes.ok) setPosts(postData.filter((post) => post.author === username));
                else throw Error(postData.error);
            } catch (err) {
                setError(err.message);
                // console.log(`error: ${error}`);
            }
        };

        fetchUser();
        // console.log(posts);

    }, [username, error]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <Navbar />
            <div className="container">
                {error && <div>{error}</div>}
                {!error && (
                    <p>Profile page for: <b>{username}</b></p>
                )}
                {user && (user.username === username) && (
                    <>
                        <hr />
                        <button onClick={handleLogout}>Log Out</button>
                        <PostForm />
                    </>
                )}
                {!error && posts && (
                    <>
                        <hr />
                        <h3>User Posts</h3>
                        {posts.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </>
                )}
                {!error && !posts && (
                    <p>This user has no posts!</p>
                )}
            </div>
        </>
    );
}

// Extend functionality so that user posts show on the profile page