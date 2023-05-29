import "./Post.css";

export default function Post({ post }) {
    return (
        <div className="post">
            <p className="content">{post.content}</p>
            <p className="author">{post.author}</p>
            <p className="date">{post.createdAt}</p>
        </div>
    );
}