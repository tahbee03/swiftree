import "./Search.css"; // Styles for Search page

import Navbar from "../components/Navbar"; // <Navbar />
import Post from "../components/Post"; // <Post />
import User from "../components/User"; // <User />

import { useState } from "react"; // useState()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Search() {
    const [dyInput, setDyInput] = useState(""); // Stores dynamic search input (form is updated)
    const [statInput, setStatInput] = useState(""); // Stores static search input (visible for comparison)
    const [posts, setPosts] = useState([]); // Stores posts matching search input
    const [users, setUsers] = useState([]); // Stores users matching search input
    const [mode, setMode] = useState("post"); // Stores the current search mode
    const [searchProcessed, setSearchProcessed] = useState(false); // Boolean value used to show search results
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Processes submitted search input
    async function handleSearch(e) {
        e.preventDefault(); // No reload on submit

        try {
            setSearchProcessed(false);

            if (mode === "post") { // Post search mode
                // Gets all posts from back-end
                const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const data = await res.json();

                if (!res.ok) throw Error(data.error);

                // Filters posts to find the ones whose content matches the search input
                setPosts(data.filter((post) => post.content.search(dyInput) !== -1));
            } else { // User search mode
                // Gets all users from back-end
                const res = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                const data = await res.json();

                if (!res.ok) throw Error(data.error);

                // Filters users to find the ones whose username matches the search input
                const usernameMatch = data.filter((u) => u.username.search(dyInput) !== -1);

                // Filters users to find the ones whose display name matches the search input
                const displayNameMatch = data.filter((u) => u.display_name.search(dyInput) !== -1);

                // Creates a combined list of unique matches
                setUsers(Array.from(new Set([].concat(usernameMatch, displayNameMatch))));
            }

            setStatInput(dyInput);
            setDyInput("");
            setSearchProcessed(true);

            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    // Changes search functionality and applies appropriate text color to buttons
    function switchMode() {
        const postButton = document.getElementById("toggle-post-mode");
        const userButton = document.getElementById("toggle-user-mode");

        if (mode === "post") {
            setMode("user");
            postButton.classList.remove("active-button");
            userButton.classList.add("active-button");
        } else {
            setMode("post");
            userButton.classList.remove("active-button");
            postButton.classList.add("active-button");
        }

        setDyInput("");
        setStatInput("");
        setPosts([]);
        setUsers([]);
        setSearchProcessed(false);
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
                            onChange={(e) => setDyInput(e.target.value)}
                            value={dyInput}
                            required
                        />
                        <button type="submit">Search</button>
                    </div>
                    <div id="search-options" className="col-sm-6 col-12">
                        <button type="button" id="toggle-post-mode" onClick={switchMode} className="active-button">Post Search</button>
                        <button type="button" id="toggle-user-mode" onClick={switchMode}>User Search</button>
                    </div>
                </form>
                <hr />
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {!error && (
                    <div id="search-results">
                        {(mode === "post") && (
                            <>
                                {searchProcessed && (posts.length === 0) && (
                                    <p>No posts match your search!</p>
                                )}
                                {!(posts.length === 0) && (
                                    <>
                                        <p id="match-text">{posts.length} posts matching "{statInput}":</p>
                                        {posts.map((post) => (
                                            <Post key={post._id} post={post} />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                        {(mode === "user") && (
                            <>
                                {searchProcessed && (users.length === 0) && (
                                    <p>No users match your search!</p>
                                )}
                                {!(users.length === 0) && (
                                    <>
                                        <p id="match-text">{users.length} users matching "{statInput}":</p>
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
        </>
    );
}