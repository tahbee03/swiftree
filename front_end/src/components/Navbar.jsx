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
            <div className="container-fluid">
                <a href="/search">
                    <img src="/search_icon.png" alt="search" className="nav-icon" />
                </a>
                <a href="/">
                    <h1>swiftree</h1>
                </a>
                {user && (
                    <a href={`/profile/${user.username}`}>
                        <div id="profile-link">
                            <p>{user.username}</p>
                            <img src="/account_icon.png" alt="account" className="nav-icon" />
                        </div>
                    </a>
                )}
                {!user && (
                    <button onClick={handleLogin}>Log In</button>
                )}
            </div>
        </nav>
    );
}