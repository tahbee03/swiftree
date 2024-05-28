import "./Post.css"; // Styles for Post component

import { useEffect, useState } from "react"; // useEffect(), useState()
import { format, formatDistanceToNow } from "date-fns"; // format(), formatDistanceToNow()
import { handleError } from "../utils"; // handleError()

export default function Post({ post, canDelete, search }) {
    const [author, setAuthor] = useState(null); // Contains data for post author
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    function linkable(text) {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
        const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gi;

        return (urlPattern.test(text) || pseudoUrlPattern.test(text));
    }

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

    async function handleClick(id) {
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);
            else window.location.reload();
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError(error);
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
                            {processContent(post.content).map((s, i) => (
                                (linkable(s)) ? (
                                    <a
                                        key={i}
                                        href={s}
                                        className="link"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {s}
                                    </a>
                                ) : (
                                    <span key={i}>{s}</span>
                                )
                            ))}
                        </>
                    )}
                </p>
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
                {canDelete && (
                    <img src="/delete_icon.png" alt="delete" onClick={() => handleClick(post._id)} id="delete-icon" />
                )}
            </div>
        </div>
    );
}

// TODO: Fix so that posts containing newline characters are more responsive