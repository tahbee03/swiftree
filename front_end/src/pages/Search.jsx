import "./Search.css"; // Styles for Search page

import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />
import Post from "../components/Post"; // <Post />
import User from "../components/User"; // <User />

import { useState } from "react"; // useState()
import { Helmet } from "react-helmet"; // <Helmet>
import { handleError } from "../utils";

export default function Search() {
    const [posts, setPosts] = useState([]); // Stores posts matching search input
    const [users, setUsers] = useState([]); // Stores users matching search input
    const [mode, setMode] = useState("post"); // Stores the current search mode
    const [input, setInput] = useState("");
    const [output, setOutput] = useState(""); // Stores text to be shown once search is done
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Processes changing search input
    function handleChange(value) {
        if (output !== "") {
            setOutput("");
            setPosts([]);
            setUsers([]);
        }

        setInput(value);
    }

    // Processes submitted search input
    async function handleSearch(e) {
        e.preventDefault(); // No reload on submit
        setIsLoading(true);

        try {
            if (mode === "post") { // Post search mode
                // Gets all posts from back-end
                const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                const matches = data.filter((p) => p.content.indexOf(input) !== -1); // Filters posts to find the ones whose content matches the search input
                if (matches.length === 0) setOutput("No posts match your search!");
                else setOutput(`${matches.length} post${(matches.length === 1) ? "" : "s"} matching "${input}":`);
                setPosts(matches);
            } else { // User search mode
                // Gets all users from back-end
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                const usernameMatch = data.filter((u) => u.username.indexOf(input) !== -1); // Filters users to find the ones whose username matches the search input
                const displayNameMatch = data.filter((u) => u.display_name.indexOf(input) !== -1); // Filters users to find the ones whose display name matches the search input
                const matches = Array.from(new Set([].concat(usernameMatch, displayNameMatch))); // Creates a combined list of unique matches
                if (matches.length === 0) setOutput("No users match your search!");
                else setOutput(`${matches.length} user${(matches.length === 1) ? "" : "s"} matching "${input}":`);
                setUsers(matches);
            }

            // setInput("");
            setError(null);
        } catch (error) {
            setError(handleError(error));
        }

        setIsLoading(false);
    }

    // Changes search functionality and applies appropriate text color to buttons
    function switchMode(newMode) {
        if (mode !== newMode) setMode(newMode);

        setPosts([]);
        setUsers([]);
        setInput("");
        setOutput("");
    }

    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; Search</title>
                <meta name="description" content="Search for posts and users on Swiftree" />
            </Helmet>
            <Navbar />
            <div className="container" id="search-cont">
                <form onSubmit={handleSearch} id="search-form" className="row">
                    <div id="search-input" className="col-sm-6 col-12">
                        <input
                            type="text"
                            name="search-input"
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder="Search here..."
                            autoComplete="off"
                            required
                        />
                        <button type="submit" disabled={isLoading}>Search</button>
                    </div>
                    <div id="search-options" className="col-sm-6 col-12">
                        <button
                            type="button"
                            id="toggle-post-mode"
                            onClick={() => switchMode("post")}
                            className={(mode === "post") ? "active-button" : ""}
                            disabled={isLoading}
                        >
                            Post Search
                        </button>
                        <button
                            type="button"
                            id="toggle-user-mode"
                            onClick={() => switchMode("user")}
                            className={(mode === "user") ? "active-button" : ""}
                            disabled={isLoading}
                        >
                            User Search
                        </button>
                    </div>
                </form>
                <hr />
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {isLoading && (
                    <div className="spinner-cont">
                        <span className="spinner-border"></span>
                    </div>
                )}
                {!error && !isLoading && (
                    <div id="search-results">
                        {(mode === "post") && (
                            <>
                                {(posts.length === 0) && (
                                    <p>{output}</p>
                                )}
                                {!(posts.length === 0) && (
                                    <>
                                        <p id="match-text">{output}</p>
                                        {posts.map((post) => (
                                            <Post
                                                key={post._id}
                                                post={post}
                                                search={{
                                                    index: post.content.indexOf(input),
                                                    input
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                        {(mode === "user") && (
                            <>
                                {(users.length === 0) && (
                                    <p>{output}</p>
                                )}
                                {!(users.length === 0) && (
                                    <>
                                        <p id="match-text">{output}</p>
                                        {users.map((user) => (
                                            <User key={user._id} user={user} />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}