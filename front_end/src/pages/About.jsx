import "./About.css" // Styles for About page

import Navbar from "../components/Navbar"; // <Navbar />
import Footer from "../components/Footer"; // <Footer />

import { Helmet } from "react-helmet"; // <Helmet>

export default function About() {
    return (
        <>
            <Helmet>
                <title>Swiftree &#8231; About</title>
                <meta name="description" content="What is Swiftree? Find your answer here!" />
            </Helmet>
            <Navbar />
            <div className="container-md" id="about-cont">
                <h1>About</h1>
                <div className="section">
                    <h2>Background</h2>
                    <p>
                        Swiftree is a social media platform that serves as a space for people to freely share their thoughts. It breaks away from the traditional scrolling
                        mechanism that most existing platforms use and instead stores user posts in a tree. This tree structure makes it harder to develop mindless
                        scrolling habits and also establishes an overall visual aesthetic for the platform.
                    </p>
                </div>
                <div className="section">
                    <h2>Target Audience</h2>
                    <p>
                        This application is intended for users that are willing to share their ideas with others and help build an online community. If you are looking
                        to engage with others via a platform with a minimalistic design and an atypical aesthetic, then Swiftree is for you!
                    </p>
                </div>
                <div className="section">
                    <h2>Tech Stack</h2>
                    <div className="row">
                        <div className="col-sm-3 col-12">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="react" />
                            <p>React</p>
                        </div>
                        <div className="col-sm-3 col-12">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/2560px-Bootstrap_logo.svg.png" alt="bootstrap" />
                            <p>Bootstrap</p>
                        </div>
                        <div className="col-sm-3 col-12">
                            <img src="https://adware-technologies.s3.amazonaws.com/uploads/technology/thumbnail/20/express-js.png" alt="express" />
                            <p>Express</p>
                        </div>
                        <div className="col-sm-3 col-12">
                            <img src="https://cdn.iconscout.com/icon/free/png-256/free-mongodb-3521676-2945120.png?f=webp" alt="mongodb" />
                            <p>MongoDB</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}