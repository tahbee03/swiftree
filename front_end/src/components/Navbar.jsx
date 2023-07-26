import "./Navbar.css";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const { user } = useAuthContext();
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/login");
    }

    window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
    });

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
                                <img src={user.pfp} alt="account" className="nav-icon" id="pfp" />
                            </div>
                        </a>
                    )}
                    {!user && (
                        <button onClick={handleLogin}>Log In</button>
                    )}
                </div>
            </div>
        </nav>
    );
}