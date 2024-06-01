import "./Highlight.css"; // Styles for Highlight page

import Post from "../components/Post"; // <Post />

import { useParams } from "react-router-dom"; // useParams()
import { useEffect, useState } from "react"; // useEffect(), useState()
import { handleError } from "../utils"; // handleError()
import { Helmet } from "react-helmet"; // <Helmet>

export default function Highlight() {
    const [postData, setPostData] = useState(null); // Contains post data from back-end
    const [isLoading, setIsLoading] = useState(true); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { id } = useParams(); // Grabs the ID of the post from the URL

    // Fetch post data when the ID is updated
    useEffect(() => {
        const fetchPost = async () => {
            setError(null);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);
                else setPostData(data);
            } catch (error) {
                setError(handleError(error));
            }

            setIsLoading(false);
        };

        fetchPost();
    }, [id]);

    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; Post Highlight</title>
                <meta name="description" content={(postData) ? postData.content : ""} />
            </Helmet>
            <div className="container" id="highlight-cont">
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {isLoading && (
                    <span className="spinner-border"></span>
                )}
                {postData && (
                    <>
                        <Post post={postData} />
                        <p>See more on <a href="/">swiftree</a></p>
                    </>
                )}
            </div>
        </>
    );
}