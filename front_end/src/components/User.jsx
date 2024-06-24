import "./User.css"; // Styles for User component

import { useEffect, useState } from "react"; // useEffect(), useState()
import { handleError } from "../utils";

export default function User({ user }) {
    const [posts, setPosts] = useState(0); // Contains number of posts for the specific user
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const page = window.location.pathname; // URL path of current page

    // Fetch data when user info is updated
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);
                else setPosts(data.filter((post) => post.author_id === user._id).length);
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        fetchData();
    }, [user]);

    return (
        <a href={`/profile/${user.username}`} className={`user-wrapper ${(page === "/search") ? "col-md-3" : "col-md-6"} col-12 ${(error || isLoading) ? "disabled-link" : ""}`}>
            <div className={`user row ${(page === "/search") ? "search-page" : "profile-page"}`}>
                {isLoading && (
                    <span className="spinner-border"></span>
                )}
                <div className={`${(page === "/search") ? "col-md-12" : ""} col-3 icon-section ${(isLoading) ? "loading" : ""}`}>
                    <img src={(user.image.url === "") ? "/account_icon.png" : user.image.url} alt="pfp" />
                </div>
                <div className={`${(page === "/search") ? "col-md-12" : ""} col-9 info-section ${(isLoading) ? "loading" : ""}`}>
                    <p className={`name text-truncate ${(page === "/search") ? "text-md-center" : ""}`}><b>{user.display_name}</b> &#183; {user.username}</p>
                    <p className={`post-num ${(page === "/search") ? "text-md-center" : ""}`}>{posts} {posts === 1 ? "post" : "posts"}</p>
                </div>
            </div >
        </a >
    );
}