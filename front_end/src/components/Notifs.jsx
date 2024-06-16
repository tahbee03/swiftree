import "./Notifs.css"; // Styles for Notifs component

import { useState, useEffect } from "react";

export default function Notifs({ setModal, notifications }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

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

    useEffect(() => {
        console.log(notifications);
    }, [notifications]);

    return (
        <div className="modal">
            <div className={`modal-content ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <p>notifs</p>
            </div>
        </div>
    );
}