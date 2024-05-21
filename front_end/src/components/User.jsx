import "./User.css"; // Styles for User component

import { useEffect, useState } from "react"; // useEffect(), useState()

export default function User({ user }) {
    const [posts, setPosts] = useState(0); // Contains number of posts for the specific user
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

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
                console.log(error);
                setError(error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [user]);

    return (
        <a href={`/profile/${user.username}`} className={`user-wrapper col-md-3 col-12 ${(error || isLoading) ? "disabled-link" : ""}`}>
            <div className="user row">
                {isLoading && (
                    <span className="spinner-border"></span>
                )}
                <div className={`col-md-12 col-3 p-md-3 icon-section ${(isLoading) ? "loading" : ""}`}>
                    <img src={(user.image.url === "") ? "/account_icon.png" : user.image.url} alt="pfp" />
                </div>
                <div className={`col-md-12 col-9 p-md-3 info-section ${(isLoading) ? "loading" : ""}`}>
                    <p className="name text-md-center text-truncate"><b>{user.display_name}</b> &#183; {user.username}</p>
                    <p className="post-num text-md-center">{posts} {posts === 1 ? "post" : "posts"}</p>
                </div>
            </div>
        </a>
    );
}