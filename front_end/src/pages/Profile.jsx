import "./Profile.css";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context_and_hooks/AuthContext";
import { useLogout } from "../context_and_hooks/useLogout";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Profile() {
    const { username } = useParams();
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/name-search/${username}`);
                const data = await res.json();

                if (!res.ok) throw Error(data.error);
                console.log(`error: ${error}`);
            } catch (err) {
                setError(err.message);
                console.log(`error: ${error}`);
            }
        };

        fetchUser();
    }, [username, error]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <Navbar />
            <div className="container">
                {error && <div>{error}</div>}
                {!error && <p>Profile page for: <b>{username}</b></p>}
                {user && (user.username === username) && <button onClick={handleLogout}>Log Out</button>}
            </div>
        </>
    );
}