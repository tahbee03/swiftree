import "./NotFound.css"; // Styles for Not Found page

import Navbar from "../components/Navbar"; // <Navbar />

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
            <main id="not-found-main" className="col-md-8 col-12">
                <h1>Page not found!</h1>
            </main>
        </>
    );
}