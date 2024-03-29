import "./ProfileUpdate.css";
import { useState, useEffect } from "react";
import PictureForm from "./PictureForm";
import EmailForm from "./EmailForm";
import UsernameForm from "./UsernameForm";
import DisplayNameForm from "./DisplayNameForm";
import PasswordForm from "./PasswordForm";
import DeleteForm from "./DeleteForm";

// TODO: Disable all other buttons and functionalities if a process is being carried out

export default function ProfileUpdate({ modalState }) {
    const [option, setOption] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const adjust = () => {
            const modalContent = document.querySelector(".modal-content");

            if (modalContent) {
                if (window.innerWidth < 576) modalContent.style.width = "90vw";
                else modalContent.style.width = "50vw";
            }

            setWindowWidth(window.innerWidth);
        };

        const close = (e) => {
            const classes = [...e.target.classList];
            if (classes.includes("modal")) modalState.setModal(null);
        };

        adjust();

        window.addEventListener("resize", adjust);
        window.addEventListener("click", close);

        return () => {
            window.addEventListener("resize", adjust);
            window.addEventListener("click", close);
        };
    });

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => modalState.setModal(null)}>&times;</div>
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
                        {(option === "picture") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <PictureForm />
                            </>

                        )}
                        {(option === "email") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <EmailForm />
                            </>
                        )}
                        {(option === "username") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <UsernameForm />
                            </>
                        )}
                        {(option === "display-name") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <DisplayNameForm />
                            </>
                        )}
                        {(option === "password") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <PasswordForm />
                            </>
                        )}
                        {(option === "delete") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <DeleteForm />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}