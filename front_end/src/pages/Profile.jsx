import "./Profile.css"; // Styles for Profile page

import PostForm from "../components/PostForm"; // <PostForm />
import ProfileUpdate from "../components/ProfileUpdate";
import Navbar from "../components/Navbar"; // <Navbar />
import PostTree from "../components/PostTree"; // <PostTree />
import Pagination from "../components/Pagination";

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useNavigate, useParams } from "react-router-dom"; // useNavigate(), useParams()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { Helmet } from "react-helmet"; // <Helmet>

function partition(arr, size) {
    // arr -> array of content (posts)
    // size -> size of partition (14)

    // [0...13], [14...27], [28...41], ...

    let p = {}; // Object to store array partitions as key-value pairs
    for (let i = 1; ((i - 1) * size) < arr.length; i++) {

        // For loop condition checks if ((i - 1) * size) is less than arr.length
        // since those will already be counted for

        // It is also checked if (i * size) is greater than arr.length within
        // the for loop to avoid going out of range when slicing

        p[i] = ((i * size) > arr.length) ? arr.slice((i - 1) * size) : arr.slice((i - 1) * size, (i * size));
    }
    return p;
}

export default function Profile() {
    const [presentedUser, setPresentedUser] = useState({
        displayName: "",
        pfp: "/account_icon.png"
    }); // Contains data for the user presented on the page
    const [posts, setPosts] = useState([]); // Contains posts to be displayed in the posts container
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate(); // Needed to redirect to another page
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL
    const { logout } = useLogout(); // Custom hook to log out logged in user
    const { user } = useAuthContext(); // Contains data for logged in user

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
            try {
                // Gets all users from back-end
                const userRes = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                const userData = await userRes.json();

                if (!userRes.ok) throw Error(userData.error);

                // Filters users to match the one in the URL
                const match = userData.filter((u) => u.username === username)[0];

                if (!match) throw Error(`The user '${username}' does not exist!`);

                // Updates the presented user's information
                setPresentedUser({
                    displayName: match.display_name,
                    pfp: match.image.url
                });

                // Gets all posts from back-end
                const postRes = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const postData = await postRes.json();

                if (!postRes.ok) throw Error(postData.error);

                // Filters posts to match the one in the URL and stores them in the state
                setPosts(postData.filter((post) => post.author_id === match._id));

                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, [username]);

    // Logs out logged in user
    function handleLogout() {
        try {
            setIsLoading(true);
            logout();
            setError(null);
            navigate("/login"); // Redirect to Login page
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; {(presentedUser.displayName === "") ? "User not found" : username}</title>
                <meta name="description" content={(presentedUser.displayName === "") ? "User not found!" : `View ${username}'s profile on Swiftree`} />
            </Helmet>
            <Navbar />
            <div className="container" id="profile-cont">
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {!error && (
                    <>
                        {(modal === "post-form") && (
                            <PostForm modalState={{ modal, setModal }} />
                        )}
                        {(modal === "update") && (
                            <ProfileUpdate modalState={{ modal, setModal }} />
                        )}
                        <div className="row">
                            <div className="col-md-3 col-12" id="info-col">
                                <img src={presentedUser.pfp} alt="account pic" />
                                <p><b>{presentedUser.displayName}</b> &#183; {username}</p>
                                <p>{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
                                {user && (user.username === username) && (
                                    <>
                                        <button type="button" onClick={() => setModal("post-form")}>Make New Post</button>
                                        <button type="button" onClick={() => setModal("update")}>Settings</button>
                                        <button type="button" onClick={handleLogout}>Log Out</button>
                                    </>
                                )}
                            </div>
                            <div className="col-md-8 col-12" id="posts-col">
                                {(posts.length === 0) && (
                                    <p>This user has no posts!</p>
                                )}
                                {(posts.length <= 14) && (
                                    <PostTree posts={posts} page={"profile"} />
                                )}
                                {(posts.length > 14) && (
                                    <>
                                        <PostTree posts={partition(posts, 14)[currentPage]} page={"profile"} />
                                        <Pagination
                                            total={Math.ceil(posts.length / 14)}
                                            current={currentPage}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}