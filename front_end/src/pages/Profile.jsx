import "./Profile.css"; // Styles for Profile page

import PostForm from "../components/PostForm"; // <PostForm />
import ProfileUpdate from "../components/ProfileUpdate";
import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />
import PostTree from "../components/PostTree"; // <PostTree />
import Pagination from "../components/Pagination"; // <Pagination />

import { sleep, partition, handleError } from "../utils"; // sleep(), partition()
import { useState, useEffect } from "react"; // useState(), useEffect()
import { useNavigate, useParams } from "react-router-dom"; // useNavigate(), useParams()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Profile() {
    const [presentedUser, setPresentedUser] = useState({
        displayName: "",
        pfp: "/account_icon.png"
    }); // Contains data for the user presented on the page
    const [posts, setPosts] = useState([]); // Contains posts to be displayed in the posts container
    const [modal, setModal] = useState(null); // Container to show post data
    const [currentPage, setCurrentPage] = useState(1); // Keeps track of current post tree page
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(true); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const navigate = useNavigate(); // Needed to redirect to another page
    const { username } = useParams(); // Grabs username of the user that the page belongs to from the URL
    const logout = useLogout(); // Custom hook to log out logged in user
    const { user } = useAuthContext(); // Contains data for logged in user

    // Runs on mount
    useEffect(() => {
        // Add event listener to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        // Remove event listener from window when component unmounts
        return () => window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    }, []);

    // Runs when username value is updated
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Gets all users from back-end
                const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                const userData = await userResponse.json();
                if (!userResponse.ok) throw new Error(userData.message);

                // Filters users to match the one in the URL
                const match = userData.filter((u) => u.username === username)[0];
                if (!match) throw new Error(`The user '${username}' does not exist!`);

                // Updates the presented user's information
                setPresentedUser({
                    displayName: match.display_name,
                    pfp: match.image.url
                });

                // Gets all posts from back-end
                const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const postData = await postResponse.json();
                if (!postResponse.ok) throw new Error(postData.message);

                // Filters posts to match the one in the URL and stores them in the state
                setPosts(postData.filter((post) => post.author_id === match._id));
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        setError(null);
        fetchUser();
    }, [username]);

    // Logs out logged in user
    async function handleLogout() {
        try {
            setIsLoading(true);
            logout();
            setError(null);
            await sleep(1); // Wait one second
            navigate("/login"); // Redirect to Login page
        } catch (error) {
            console.log(error);
            setError(error);
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
            <div className={`container ${(windowWidth < 768) ? "mini" : ""}`} id="profile-cont">
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {isLoading && (
                    <span className="spinner-border"></span>
                )}
                {!error && !isLoading && (
                    <>
                        {(modal === "post-form") && (
                            <PostForm setModal={setModal} />
                        )}
                        {(modal === "update") && (
                            <ProfileUpdate modalState={{ modal, setModal }} />
                        )}
                        <div className="row">
                            <div className={`col-md-3 col-12 ${(windowWidth < 768) ? "mini" : ""}`} id="info-col">
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
                            <div className={`col-md-8 col-12 ${(windowWidth < 768) ? "mini" : ""}`} id="posts-col">
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
            <Footer />
        </>
    );
}