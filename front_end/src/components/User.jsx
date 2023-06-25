import "./User.css";

export default function User({ user }) {
    return (
        <a href={`/profile/${user.username}`}>
            <div className="user row">
                <div className="col-3" id="icon-section">
                    <img src="/account_icon.png" alt="pfp" />
                </div>
                <div className="col-9" id="info-section">
                    <p className="username">{user.username}</p>
                    <p className="post-num">{user.posts.length} {user.posts.length === 1 ? "post" : "posts"}</p>
                </div>
            </div>
        </a>
    );
}