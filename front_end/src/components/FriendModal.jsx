import "./FriendModal.css"; // Styles for Friend Modal component

import User from "./User"; // <User />

import { useState, useEffect } from "react"; // useState(), useEffect()
import { handleError } from "../utils"; // handleError()

export default function FriendModal({ setModal, friends }) {
    const [friendData, setFriendData] = useState([]); // List of data for each friend
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    // Runs when setModal() is loaded
    useEffect(() => {
        const close = (e) => {
            const classes = [...e.target.classList]; // Grab the list of classes that are detected
            if (classes.includes("modal")) setModal(null);
        };

        // Add event listeners to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
        window.addEventListener("click", close);

        // Remove event listeners from window when component unmounts
        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
            window.removeEventListener("click", close);
        }
    }, [setModal]);

    // Runs when friends value is loaded
    useEffect(() => {
        // Fetch the data of all the friends in the friends list
        const processFriends = async (list) => {
            let temp = [];
            setIsLoading(true);
            setError(null);

            for (let f of list) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${f.user_id}`);
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.message);
                    else temp.push(data);
                } catch (error) {
                    setError(handleError(error));
                }
            }

            setFriendData(temp);
            setIsLoading(false);
        };

        processFriends(friends);
    }, [friends]);

    return (
        <div className="modal">
            <div className={`modal-content friends ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                {error && (
                    <div className="error-msg">{error}</div>
                )}
                {isLoading && (
                    <span className="spinner-border"></span>
                )}
                {!error && !isLoading && (
                    <>
                        <h3>Friends</h3>
                        <h4 className="count">{friendData.length} {friendData.length === 1 ? "friend" : "friends"}</h4>
                        {(friendData.length === 0) ? (
                            <p>This user has no friends!</p>
                        ) : (
                            <div className="friend-cont">
                                {friendData.map((f, i) => (
                                    <User key={i} user={f} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}