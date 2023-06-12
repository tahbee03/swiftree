import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <a href="/search">
                    <img src="/search_icon.png" alt="search" className="nav-icon" />
                </a>
                <a href="/">
                    <h1>swiftree</h1>
                </a>
                <a href="/profile">
                    <img src="/account_icon.png" alt="account" className="nav-icon" />
                </a>
            </div>
        </nav>
    );
}