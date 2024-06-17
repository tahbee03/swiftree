import "./NotifModal.css"; // Styles for NotifModal component

import Notification from "./Notification"; // <Notification />

import { useState, useEffect } from "react"; // useState(), useEffect()
import { useNotifContext } from "../hooks/useNotifContext"; // useNotifContext()

export default function NotifModal({ setModal }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

    const { notifications } = useNotifContext(); // Contains notifications for logged in user

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

    // Counts the number of unread notifications
    function unreadCheck() {
        if (notifications && notifications.length > 0) return notifications.filter(n => !n.read).length;
        else return 0;
    }

    return (
        <div className="modal">
            <div className={`modal-content notifs ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <h3>Notifications</h3>
                {(unreadCheck() > 0) && (
                    <h4 className="unread">{unreadCheck()} unread</h4>
                )}
                {(notifications.length === 0) ? (
                    <p>You have no notifications!</p>
                ) : (
                    <div className="notif-cont">
                        {notifications.map((n, i) => (
                            <Notification key={i} content={n} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}