import "./Post.css";

export default function Post({ post }) {
    async function handleClick(id) {
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

        if (res.ok) console.log("Post removed!");
        else console.log("Error removing post.");
    }

    return (
        <div className="post">
            <p className="content">{post.content}</p>
            <p className="author">{post.author}</p>
            <p className="date">{post.createdAt}</p>
            <img src="/delete_icon.png" alt="delete" onClick={() => handleClick(post._id)} />
        </div>
    );
} 