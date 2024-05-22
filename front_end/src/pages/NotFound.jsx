import "./NotFound.css"; // Styles for Not Found page

import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer";

import { Helmet } from "react-helmet"; // <Helmet>

export default function NotFound() {
    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Page not found</title>
                <meta name="description" content="Please enter a valid URL." />
            </Helmet>
            <Navbar />
            <div id="not-found-cont" className="container">
                <h1>Page not found!</h1>
            </div>
            <Footer />
        </>
    );
}