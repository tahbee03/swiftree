import "./Post.css";
import format from "date-fns/format";

export default function Post({ post, canDelete }) {
    async function handleClick(id) {
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

        if (res.ok) console.log("Post removed!");
        else console.log("Error removing post.");
    }

    return (
        <div className="post row">
            <div className="col-9 info-section">
                <p className="content">{post.content}</p>
                <p className="author">{post.author}</p>
                <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")}`}</p>
            </div>
            <div className="col-3 icon-section">
                {canDelete && (
                    <img src="/delete_icon.png" alt="delete" onClick={() => handleClick(post._id)} id="delete-icon" />
                )}
            </div>
        </div>
    );
}