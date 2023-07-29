import "./ProfileUpdate.css";
import { useState } from "react";
import PictureForm from "./PictureForm";

export default function ProfileUpdate({ modalState }) {
    const [option, setOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Boolean value used to render loading spinner
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    window.addEventListener("click", (e) => {
        const classes = [...e.target.classList];
        if (classes.includes("modal")) modalState.setModal(null);
    });

    window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
    });

    // option: email

    // option: username

    // option: display name

    // option: password

    // option: delete

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
                                <p>not available</p>
                            </>
                        )}
                        {(option === "username") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <p>not available</p>
                            </>
                        )}
                        {(option === "display-name") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <p>not available</p>
                            </>
                        )}
                        {(option === "password") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <p>not available</p>
                            </>
                        )}
                        {(option === "delete") && (
                            <>
                                {(windowWidth < 992) && (
                                    <hr className="divider" />
                                )}
                                <p>not available</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}