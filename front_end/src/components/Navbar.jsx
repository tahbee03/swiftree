import "./Navbar.css"; // Styles for Navbar component

import { useState, useEffect } from "react"; // useState()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useNavigate } from "react-router-dom"; // useNavigate()

export default function Navbar() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

    const { user } = useAuthContext(); // Contains data for logged in user
    const navigate = useNavigate(); // Needed to redirect to another page

    // Runs on mount
    useEffect(() => {
        // Add event listener to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        // Remove event listener from window when component unmounts
        return () => window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    }, []);

    return (
        <nav className="navbar">
            <div className="row">
                <div className="col-4" id="left">
                    <a href="/search">
                        <img src="/search_icon.png" alt="search" className="nav-icon" />
                    </a>
                </div>
                <div className="col-4" id="middle">
                    <a href="/">
                        <h1>swiftree</h1>
                    </a>
                </div>
                <div className="col-4" id="right">
                    {user && (
                        <a href={`/profile/${user.username}`}>
                            <div id="profile-link">
                                {(windowWidth >= 576) && (
                                    <p>{user.display_name}</p>
                                )}
                                <img
                                    src={user.pfp}
                                    alt="account"
                                    className="nav-icon"
                                    id="pfp"
                                    draggable="false"
                                />
                            </div>
                        </a>
                    )}
                    {!user && (
                        <button onClick={() => navigate("/login")}>Log In</button>
                    )}
                </div>
            </div>
        </nav>
    );
}