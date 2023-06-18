import "./Profile.css";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useLogout } from "../context_and_hooks/useLogout";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function handleLogin() {
        navigate("/login");
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <p>profile page</p>
                {user && (
                    <>
                        <p>{user.username}</p>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                )}
                {!user && (
                    <button onClick={handleLogin}>Log In</button>
                )}
            </div>
        </>
    );
}