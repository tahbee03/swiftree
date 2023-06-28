import "./Search.css";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import User from "../components/User";
import { useState } from "react";

export default function Search() {
    const [searchInput, setSearchInput] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [mode, setMode] = useState("post");

    async function handleSearch(e) {
        e.preventDefault();

        if (mode === "post") {
            const res = await fetch("/api/posts");
            const data = await res.json();

            if (res.ok) setPosts(data.filter((post) => post.content.search(searchInput) !== -1));
        } else {
            const res = await fetch("/api/users");
            const data = await res.json();

            if (res.ok) setUsers(data.filter((user) => user.username.search(searchInput) !== -1));
        }

        setSearchKey(searchInput);
        setSearchInput("");
    }

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

        setSearchInput("");
        setSearchKey("");
        setPosts(null);
        setUsers(null);
    }

    return (
        <>
            <Navbar />
            <div className="container" id="search-cont">
                <form onSubmit={handleSearch} id="search-form" className="row">
                    <div id="search-input" className="col-6">
                        <input
                            type="text"
                            name="search-input"
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={searchInput}
                            required
                        />
                        <button type="submit">Search</button>
                    </div>
                    <div id="search-options" className="col-6">
                        <button type="button" id="toggle-post-mode" onClick={switchMode} className="active-button">Post Search</button>
                        <button type="button" id="toggle-user-mode" onClick={switchMode}>User Search</button>
                    </div>
                </form>
                <hr />
                <div id="search-results">
                    {(mode === "post") && (
                        <>
                            {!posts && (
                                <></>
                            )}
                            {posts && (
                                <>
                                    {(posts.length === 0) && (
                                        <p>No posts match your search!</p>
                                    )}
                                    {!(posts.length === 0) && (
                                        <>
                                            <p id="match-text">Posts matching "{searchKey}"</p>
                                            {posts.map((post) => (
                                                <Post key={post._id} post={post} />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {(mode === "user") && (
                        <>
                            {!users && (
                                <></>
                            )}
                            {users && (
                                <>
                                    {(users.length === 0) && (
                                        <p>No users match your search!</p>
                                    )}
                                    {!(users.length === 0) && (
                                        <>
                                            <p id="match-text">Users matching "{searchKey}"</p>
                                            {users.map((user) => (
                                                <User key={user._id} user={user} />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}