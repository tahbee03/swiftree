import "./Profile.css"; // Styles for Profile page

import PostForm from "../components/PostForm"; // <PostForm />
import Notifs from "../components/Notifs"; // <Notifs />
import ProfileUpdate from "../components/ProfileUpdate"; // <ProfileUpdate />
import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />
import PostTree from "../components/PostTree"; // <PostTree />
import TreeMode from "../components/TreeMode"; // <TreeMode />
import Pagination from "../components/Pagination"; // <Pagination />

import { sleep, partition, handleError } from "../utils"; // sleep(), partition(), handleError()
import { useState, useEffect } from "react"; // useState(), useEffect()
import { useNavigate, useParams } from "react-router-dom"; // useNavigate(), useParams()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useLogout } from "../hooks/useLogout"; // useLogout()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Profile() {
    const [presentedUser, setPresentedUser] = useState({
        displayName: "",
        pfp: "/account_icon.png",
        id: "",
        username: ""
    }); // Contains data for the user presented on the page
    const [filteredPosts, setFilteredPosts] = useState([]); // Contains posts to be displayed in the posts container
    const [allPosts, setAllPosts] = useState([]); // Contains all posts related to user
    const [notifs, setNotifs] = useState([]); // Contains all notifications related to the signed in user
    const [modal, setModal] = useState(null); // Pop-up container to show forms
    const [currentPage, setCurrentPage] = useState(1); // Keeps track of current post tree page
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [mode, setMode] = useState("all"); // Sets tree display mode
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

    // Runs when user and username values are updated
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
                    username: match.username,
                    pfp: match.image.url,
                    id: match._id
                });

                // Gets all posts from back-end
                const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const postData = await postResponse.json();
                if (!postResponse.ok) throw new Error(postData.message);

                // Filters posts to match the one in the URL and stores them in the state
                const p = postData.filter((post) => (post.author_id === match._id || post.content.includes(`@${match.username}`)));
                setAllPosts(p);
                setFilteredPosts(p);

                if (user && user.username === match.username) {
                    const notifResponse = await fetch(`${process.env.REACT_APP_API_URL}/notifications`);
                    const notifData = await notifResponse.json();
                    if (!notifResponse.ok) throw new Error(notifData.message);

                    const n = notifData.filter((notif) => (notif.user_id = user.id));
                    setNotifs(n);
                }
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        setError(null);
        fetchUser();
    }, [user, username]);

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

    // Changes post tree display and applies appropriate text color to buttons
    function switchMode(newMode) {
        if (mode !== newMode) setMode(newMode);

        if (newMode === "owned") setFilteredPosts(allPosts.filter((post) => post.author_id === presentedUser.id)); // Only show posts the user created themselves
        else if (newMode === "tagged") setFilteredPosts(allPosts.filter((post) => post.content.includes(`@${presentedUser.username}`))); // Only show posts the user is tagged in
        else setFilteredPosts(allPosts); // Show all related posts
    }

    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; {(presentedUser.username === "") ? "User not found" : presentedUser.username}</title>
                <meta name="description" content={(presentedUser.username === "") ? "User not found!" : `View ${presentedUser.username}'s profile on Swiftree`} />
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
                        {(modal === "notifs") && (
                            <Notifs setModal={setModal} notifications={notifs} />
                        )}
                        {(modal === "update") && (
                            <ProfileUpdate setModal={setModal} />
                        )}
                        <div className="row">
                            <div className={`col-md-3 col-12 ${(windowWidth < 768) ? "mini" : ""}`} id="info-col">
                                <img src={presentedUser.pfp} alt="account pic" />
                                <p><b>{presentedUser.displayName}</b> &#183; {presentedUser.username}</p>
                                <p>{filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}</p>
                                {user && (user.username === presentedUser.username) && (
                                    <>
                                        <button type="button" onClick={() => setModal("post-form")}>Make New Post</button>
                                        <button type="button" onClick={() => setModal("notifs")}>Notifications</button>
                                        <button type="button" onClick={() => setModal("update")}>Settings</button>
                                        <button type="button" onClick={handleLogout}>Log Out</button>
                                    </>
                                )}
                            </div>
                            <div className={`col-md-8 col-12 ${(windowWidth < 768) ? "mini" : ""}`} id="posts-col">
                                {(allPosts.length === 0) ? (
                                    <p>This user has no posts!</p>
                                ) : (
                                    <>
                                        <TreeMode mode={mode} switchMode={switchMode} />
                                        {(filteredPosts.length === 0) && (mode === "owned") && (
                                            <p>This user has not created any posts!</p>
                                        )}
                                        {(filteredPosts.length === 0) && (mode === "tagged") && (
                                            <p>This user is not tagged in any posts!</p>
                                        )}
                                        {(filteredPosts.length > 0 && filteredPosts.length <= 14) && (
                                            <PostTree posts={filteredPosts} page={"profile"} />
                                        )}
                                        {(filteredPosts.length > 14) && (
                                            <>
                                                <PostTree posts={partition(filteredPosts, 14)[currentPage]} page={"profile"} />
                                                <Pagination
                                                    total={Math.ceil(filteredPosts.length / 14)}
                                                    current={currentPage}
                                                    setCurrentPage={setCurrentPage}
                                                />
                                            </>
                                        )}
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