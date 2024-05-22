import "./Footer.css"; // Styles for Footer component

export default function Footer() {
    return (
        <footer className="footer">
            <div className="row">
                <div className="col-md-6 col-12">
                    <div className="image-wrapper">
                        <img src="/swiftree_logo.png" alt="prop" />
                    </div>
                    <h1>swiftree</h1>
                </div>
                <div className="col-md-6 col-12">
                    <a href="/" className="footer-link">
                        About
                    </a>
                    <a href="/" className="footer-link">
                        Help
                    </a>
                    <a href="https://github.com/tahbee03/swiftree" className="footer-link">
                        Source
                    </a>
                </div>
            </div>
        </footer>
    );
}