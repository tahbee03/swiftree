import "./PictureForm.css";
import { useState } from "react";

export default function PictureForm() {
    const [selectedFile, setSelectedFile] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();

        console.log(selectedFile);
    }

    return (
        <form className="pfp-form" onSubmit={handleSubmit}>
            <h3>New Profile Picture</h3>

            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button type="submit">Upload Picture</button>
        </form>
    );
}