import "./User.css";

import { useEffect, useState } from "react";

export default function User({ user }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            // Gets all posts from back-end
            const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const data = await res.json();

            // Error with back-end
            if (!res.ok) throw Error(data.error); // TODO: Handle properly

            // Filters posts to match the one in the URL and updates the posts to be shown
            setPosts(data.filter((post) => post.author_id === user._id));

            setIsLoading(false);
        }

        fetchData();
    }, []);

    return (
        <>
            {isLoading && (
                <span className="spinner-border"></span>
            )}
            {!isLoading && (
                <a href={`/profile/${user.username}`}>
                    <div className="user row">
                        <div className="col-3 icon-section">
                            {(user.image.url === "") && (
                                <img src="/account_icon.png" alt="pfp" />
                            )}
                            {!(user.image.url === "") && (
                                <img src={user.image.url} alt="pfp" />
                            )}
                        </div>
                        <div className="col-9 info-section">
                            <p className="name"><b>{user.display_name}</b> &#183; {user.username}</p>
                            <p className="post-num">{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
                        </div>
                    </div>
                </a>
            )}
        </>
    );
}