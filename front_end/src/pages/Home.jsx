import "./Home.css"; // Styles for Home page

import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />
import PostTree from "../components/PostTree"; // <PostTree />
import TreeMode from "../components/TreeMode"; // <TreeMode />

import { useEffect, useState } from "react"; // useEffect(), useState()
import { Helmet } from "react-helmet"; // <Helmet />
import { handleError } from "../utils"; // handleError()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export default function Home() {
    const [filteredPosts, setFilteredPosts] = useState([]); // Contains posts to be displayed in the posts container
    const [allPosts, setAllPosts] = useState([]); // Contains all posts related to user
    const [mode, setMode] = useState("universal"); // Sets tree display mode
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user

    // Runs on component render
    useEffect(() => {
        // Gets all posts from back-end
        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                const now = new Date().getTime();
                const p = data.filter((p) => (now - new Date(p.createdAt).getTime()) < (3600000 * 24));
                setAllPosts(p);
                setFilteredPosts(p);
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        setError(null);
        fetchPosts();
    }, []);

    // Changes post tree display and applies appropriate text color to buttons
    function switchMode(newMode) {
        if (mode !== newMode) setMode(newMode);

        if (newMode === "friends") setFilteredPosts(allPosts.filter((post) => {
            for (let f of user.friends) {
                if (f.user_id === post.author_id && f.code === "CR") return true;
            }
            return false;
        })); // Only show posts made by the user's friends
        else setFilteredPosts(allPosts); // Show all related posts
    }

    // Renders elements
    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree</title>
                <meta name="description" content="Welcome to Swiftree!" />
            </Helmet>
            <Navbar />
            <div className="container" id="home-cont">
                {error && (
                    <p className="error-msg">{error}</p>
                )}
                {isLoading && (
                    <div className="spinner-cont">
                        <span className="spinner-border"></span>
                    </div>
                )}
                {!error && !isLoading && (
                    <>
                        {user && (
                            <TreeMode mode={mode} switchMode={switchMode} options={["universal", "friends"]} />
                        )}
                        {(filteredPosts.length === 0) && (
                            <p className="tree-text">No new posts. Check back later!</p>
                        )}
                        <PostTree posts={(filteredPosts.length > 14) ? filteredPosts.slice(0, 14) : filteredPosts} page={"home"} />
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}