import "./User.css";

export default function User({ user }) {
    return (
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
                    <p className="post-num">{user.posts.length} {user.posts.length === 1 ? "post" : "posts"}</p>
                </div>
            </div>
        </a>
    );
}