import "./ProfileUpdate.css"; // Styles for Profile Update component

import PictureForm from "./PictureForm"; // <PictureForm />
import EmailForm from "./EmailForm"; // <EmailForm />
import UsernameForm from "./UsernameForm"; // <UsernameForm />
import DisplayNameForm from "./DisplayNameForm"; // <DisplayNameForm />
import PasswordForm from "./PasswordForm"; // <PasswordForm />
import DeleteForm from "./DeleteForm"; // <DeleteForm />

import { useState, useEffect } from "react"; // useState(), useEffect()

export default function ProfileUpdate({ setModal }) {
    const [option, setOption] = useState(null); // Selected form
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Contains the browser window width

    // Runs when setModal() is loaded
    useEffect(() => {
        const close = (e) => {
            const classes = [...e.target.classList]; // Grab the list of classes that are detected
            if (classes.includes("modal")) setModal(null);
        };

        // Add event listeners to window for this specific component 
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
        window.addEventListener("click", close);

        // Remove event listeners from window when component unmounts
        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
            window.removeEventListener("click", close);
        }
    }, [setModal]);

    function renderForm(opt) {
        switch (opt) {
            case "picture":
                return <PictureForm />;
            case "email":
                return <EmailForm />;
            case "username":
                return <UsernameForm />;
            case "display-name":
                return <DisplayNameForm />;
            case "password":
                return <PasswordForm />;
            case "delete":
                return <DeleteForm />;
            default:
                return;
        }
    }

    return (
        <div className="modal">
            <div className={`modal-content ${(windowWidth < 768) ? "mini" : ""}`}>
                <div className="close" onClick={() => setModal(null)}>&times;</div>
                <div className="row">
                    <div className="col-lg-6 col-12" id="options">
                        <button
                            className={(option === "picture") ? "active-button" : ""}
                            onClick={() => setOption("picture")}
                        >
                            Update Profile Picture
                        </button>
                        <button
                            className={(option === "email") ? "active-button" : ""}
                            onClick={() => setOption("email")}
                        >
                            Update Email
                        </button>
                        <button
                            className={(option === "username") ? "active-button" : ""}
                            onClick={() => setOption("username")}
                        >
                            Update Username
                        </button>
                        <button
                            className={(option === "display-name") ? "active-button" : ""}
                            onClick={() => setOption("display-name")}
                        >
                            Update Display Name
                        </button>
                        <button
                            className={(option === "password") ? "active-button" : ""}
                            onClick={() => setOption("password")}
                        >
                            Update Password
                        </button>
                        <button
                            className={(option === "delete") ? "active-button" : ""}
                            onClick={() => setOption("delete")}
                        >
                            Delete Account
                        </button>
                    </div>
                    <div className="col-lg-6 col-12">
                        {(option) && (windowWidth < 992) && (<hr className="divider" />)}
                        {renderForm(option)}
                    </div>
                </div>
            </div>
        </div>
    );
}