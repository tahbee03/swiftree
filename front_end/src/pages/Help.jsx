import "./Help.css"; // Styles for Help page

import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />

import { Helmet } from "react-helmet"; // <Helmet>

export default function Help() {
    return (
        <>
            <Helmet>
                {/* Default meta tags */}
                <title>Swiftree &#8231; Help</title>
                <meta name="description" content="Learn how to navigate the Swiftree application" />
            </Helmet>
            <Navbar />
            <div className="container-md" id="help-cont">
                <h1>Help</h1>
                <div className="section">
                    <h2>Home Page</h2>
                    <p>
                        The main component of the home page is the <span className="keyword">Universal Tree</span>. Here, a select number of recent posts made by users
                        will be displayed for everyone to see. To interact with the tree, simply click the nodes of the tree to open the corresponding posts. Clicking the
                        refresh button at the root of the tree will rearrange the positioning of the nodes. The tree is based on the&nbsp;
                        <a
                            href="https://www.geeksforgeeks.org/introduction-to-min-heap-data-structure/"
                            className="help-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            min-heap data structure
                        </a>
                        , meaning that the closer the posts are to the root, the more recent they are. Nodes that were opened will be filled to help you keep track of what
                        you have already opened. When you log in and make friends, you will be able access the <span className="keyword">Friend Tree</span>, which
                        shows the most recent posts made by your friends.
                    </p>
                    <img src="/visual1.gif" alt="visual1" className="visual" draggable="false" />
                    <img src="/visual2.gif" alt="visual2" className="visual" draggable="false" />
                </div>
                <div className="section">
                    <h2>Profile Page</h2>
                    <p>
                        Your very own profile page! Here, you can customize your profile with the available settings and manage all the posts you have made in your&nbsp;
                        <span className="keyword">Personal Tree</span>
                        . You can also view your friends, manage incoming friend requests, and view any notifications you may have. When viewing another user's
                        profile, you can manage your friend status with them.
                    </p>
                    <img src="/visual3.gif" alt="visual3" className="visual" draggable="false" />
                </div>
                <div className="section">
                    <h2>Search Page</h2>
                    <p>
                        Looking for a specific user or post? Find them here! Simply type your search input in the search bar and it will fetch any matching posts or users,
                        depending on the mode you have selected. For posts, the matching text will be highlighted so it is easier to locate. For users, your search input
                        will be used to match both display names and usernames.
                    </p>
                    <img src="/visual4.gif" alt="visual4" className="visual" draggable="false" />
                    <img src="/visual5.gif" alt="visual5" className="visual" draggable="false" />
                </div>
            </div>
            <Footer />
        </>
    );
}