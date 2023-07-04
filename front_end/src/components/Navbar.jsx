import "./Navbar.css";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/login");
    }

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
                                <p>{user.display_name}</p>
                                {(user.pfp === "") && (
                                    <img src="/account_icon.png" alt="account" className="nav-icon" id="pfp" />
                                )}
                                {!(user.pfp === "") && (
                                    <img src={user.pfp} alt="account" className="nav-icon" id="pfp" />
                                )}
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