// import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <img src="/search_icon.png" alt="search" className="nav-icon"/>
                <h1>swiftree</h1>
                <img src="/account_icon.png" alt="account" className="nav-icon"/>
            </div>
        </nav>
    );
}