import "./Post.css"; // Styles for Post component

import { useEffect, useState } from "react"; // useEffect(), useState()
import { format, formatDistanceToNow } from "date-fns"; // format(), formatDistanceToNow()
import { sleep, handleError } from "../utils"; // sleep(), handleError()

export default function Post({ post, isAuthor, search }) {
    const [author, setAuthor] = useState(null); // Contains data for post author
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [isEditMode, setIsEditMode] = useState(false); // State that is triggered when edit mode is enabled
    const [isCopied, setIsCopied] = useState(false); // State that is triggered when the post link is copied
    const [newContent, setNewContent] = useState(post.content); // Contains data to put into post
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Fetch data when post info is updated
    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${post.author_id}`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);
                else setAuthor(data);
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        setError(null);
        fetchUser();
    }, [post]);

    useEffect(() => {
        if (!isEditMode) setNewContent(post.content);
    }, [isEditMode, post.content]);

    // Helper function that checks if there are links in a post
    function linkable(text) {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
        const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gi;

        return (urlPattern.test(text) || pseudoUrlPattern.test(text));
    }

    // Helper function that checks if there are tags in a post
    function taggable(text) {
        const tagPattern = /@[a-z0-9._]+/g;
        return tagPattern.test(text);
    }

    // Helper function that splits a string into an array of substrings (including whitespace characters)
    function processContent(text) {
        function innerJoin(array, char) {
            let result = [];

            for (let i = 0; i < array.length; i++) {
                result.push(array[i]);
                if (i !== array.length - 1) result.push(char);
            }

            return result;
        }

        const newlineSplit = text.split("\n");
        for (let i = 0; i < newlineSplit.length; i++) newlineSplit[i] = newlineSplit[i].split(" ");
        for (let i = 0; i < newlineSplit.length; i++) newlineSplit[i] = innerJoin(newlineSplit[i], " ");
        return innerJoin(newlineSplit, "\n").flat(1);
    }

    // Helper function that returns the corresponding element based on the substring of text
    function convertContent(text, index) {
        if (linkable(text)) {
            return <a
                key={index}
                href={text}
                className="link"
                target="_blank"
                rel="noreferrer"
            >
                {text}
            </a>;
        } else if (taggable(text)) {
            return <a
                key={index}
                href={`/profile/${text.substring(1)}`}
                className="tag"
            >
                {text}
            </a>;
        } else {
            return <span key={index}>{text}</span>;
        }
    }

    // Copies post link to clipboard
    async function handleShare() {
        setIsCopied(true);
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        await sleep(1);
        setIsCopied(false);
    }

    // Updates post data in the back-end
    async function handleEdit() {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newContent })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);
            else window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
        }
    }

    // Deletes post
    async function handleDelete() {
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);
            else window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
        }
    }

    return (
        <div className="post row">
            {error && (
                <div className="error-msg">{error}</div>
            )}
            {isLoading && (
                <span className="spinner-border"></span>
            )}
            <div className={`col-lg-9 col-12 info-section ${isLoading ? "loading" : ""}`}>
                {(isEditMode) ? (
                    <>
                        <textarea onChange={(e) => setNewContent(e.target.value)} value={newContent}></textarea>
                        <button onClick={handleEdit} disabled={post.content === newContent}>Save</button>
                    </>
                ) : (
                    <>
                        <p className="content">
                            {(search) ? (
                                <>
                                    {post.content.substring(0, search.index)}
                                    <span className="highlight">
                                        {post.content.substring(search.index, search.index + search.input.length)}
                                    </span>
                                    {post.content.substring(search.index + search.input.length)}
                                </>
                            ) : (
                                <>
                                    {processContent(post.content).map((s, i) => convertContent(s, i))}
                                </>
                            )}
                        </p>
                        {(post.createdAt !== post.updatedAt) && (
                            <p className="edited">(edited)</p>
                        )}
                    </>
                )}
                <a href={(author) ? `/profile/${author.username}` : ""} className="author-section">
                    <img src={(author) ? author.image.url : "/account_icon.png"} alt="user-pfp" />
                    <p>{(author) ? author.display_name : ""}</p>
                </a>
                {window.location.pathname === "/" && (
                    <p className="date">{`Posted ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}`}</p>
                )}
                {!(window.location.pathname === "/") && (
                    <p className="date">{`Posted on ${format(new Date(post.createdAt), "MM/dd/yyyy")} at ${format(new Date(post.createdAt), "hh:mm  a")} (${format(new Date(post.createdAt), "O")})`}</p>
                )}
            </div>
            <div className={`col-lg-3 col-12 icon-section ${isLoading ? "loading" : ""}`}>
                {(isCopied) ? (
                    <p>Copied!</p>
                ) : (
                    <img src="/share_icon.png" alt="share" className="icon" id="share-icon" onClick={handleShare} />
                )}
                {isAuthor && (
                    <>
                        <img src="/edit_icon.png" alt="edit" className="icon" id="edit-icon" onClick={() => setIsEditMode(!isEditMode)} />
                        <img src="/delete_icon.png" alt="delete" className="icon" id="delete-icon" onClick={handleDelete} />
                    </>
                )}
            </div>
        </div>
    );
}

// TODO: Fix so that posts containing newline characters are more responsive