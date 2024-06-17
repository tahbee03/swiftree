import "./Notification.css"; // Styles for Notification component

import { useState } from "react"; // useState()
import { handleError } from "../utils"; // handleError()
import { useNotifContext } from "../hooks/useNotifContext"; // useNotifContext()
import { format, formatDistanceToNow } from "date-fns"; // format(), formatDistanceToNow()

export default function Notification({ content }) {
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [error, setError] = useState(null); // Stores error from back-end response (if any)

    const { notifications, dispatch } = useNotifContext(); // Contains notifications for logged in user and function to update notifications in NotifContext

    // Toggles the read/unread state of a notification
    async function handleRead() {
        setIsLoading(true);

        try {
            // Make changes in back-end
            const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${content._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: !content.read })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            // Make changes in context
            const tempNotifs = notifications;
            const index = tempNotifs.findIndex((n) => n._id === content._id);
            tempNotifs[index].read = !content.read;
            dispatch({ type: "SET", payload: tempNotifs });
        } catch (error) {
            setError(handleError(error));
        }

        setIsLoading(false);
    }

    // Deletes notification
    async function handleDelete() {
        setIsLoading(true);

        try {
            // Make changes in back-end
            const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${content._id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            // Make changes in context
            dispatch({ type: "SET", payload: notifications.filter(n => n._id !== content._id) });
        } catch (error) {
            setError(handleError(error));
        }

        setIsLoading(false);
    }

    // Returns notification time based on how long ago it was posted
    function notifTime() {
        const now = new Date().getTime();

        if ((now - new Date(content.createdAt).getTime()) < (3600000 * 24)) { // Notification was sent less than 24 hours ago
            return formatDistanceToNow(new Date(content.createdAt), { addSuffix: true });
        } else {
            return format(new Date(content.createdAt), "MM/dd/yyyy");
        }
    }

    return (
        <>
            {error && (
                <div className="error-msg">{error}</div>
            )}
            {!error && content && (
                <div className={`notification row ${(content.read) ? "read" : "unread"}`}>
                    {(isLoading) ? (
                        <span className="spinner-border"></span>
                    ) : (
                        <>
                            <div className="col-md-1 col-2 icon-section">
                                <img src={content.icon} alt="notification icon" draggable="false" />
                            </div>
                            <div className="col-md-8 col-10 content-section">
                                <p>{content.message}</p>
                                <p style={{ color: "gray" }}>{notifTime()}</p>
                            </div>
                            <div className="col-md-3 col-12 ctrl-section">
                                <button onClick={handleRead}>{(content.read) ? "Mark Unread" : "Mark Read"}</button>
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}