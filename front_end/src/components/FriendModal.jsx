import "./FriendModal.css"; // Styles for Friend Modal component

import User from "./User"; // <User />

import { useState, useEffect } from "react"; // useState(), useEffect()
import { handleError } from "../utils"; // handleError()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export default function FriendModal({ setModal, friends }) {
    const [friendData, setFriendData] = useState([]); // List of data for each friend
    const [pendingData, setPendingData] = useState([]); // List of pending friend requests
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { user } = useAuthContext(); // Contains data for logged in user

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
            let tempFriends = [];
            let tempPending = [];
            setIsLoading(true);
            setError(null);

            for (let f of list) {
                if (f.code === "SR") continue; // Skip users that are not friends and have not send a friend request

                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${f.user_id}`);
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.message);

                    if (f.code === "CR") tempFriends.push(data);
                    else tempPending.push(data);
                } catch (error) {
                    setError(handleError(error));
                }
            }

            setFriendData(tempFriends);
            setPendingData(tempPending);
            setIsLoading(false);
        };

        processFriends(friends);
    }, [friends]);

    // Carry out specified action to update friends list in back-end
    async function handleFriendControl({ friend, mode }) {
        const request = {
            from: user.id,
            to: friend._id,
            action: mode
        };

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/friends`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            sessionStorage.setItem("user", JSON.stringify({
                ...user,
                friends: data.friends
            }));

            window.location.reload();
        } catch (error) {
            setError(handleError(error));
            setIsLoading(false);
        }
    }

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
                        {user && window.location.pathname === `/profile/${user.username}` && pendingData.length > 0 && (
                            <>
                                <hr />
                                <h4>Pending</h4>
                                <div className="pending-cont">
                                    {pendingData.map((p, i) => (
                                        <div key={i} className="pending row">
                                            <User user={p} />
                                            <div className={`buttons col-md-6 col-12 ${(windowWidth < 768) ? "mini" : ""}`}>
                                                <button className="accept" onClick={() => handleFriendControl({ friend: p, mode: "accept" })}>&#10004;</button>
                                                <button className="decline" onClick={() => handleFriendControl({ friend: p, mode: "decline" })}>&#10006;</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}