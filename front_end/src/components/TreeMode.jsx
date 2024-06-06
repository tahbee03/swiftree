import "./TreeMode.css"; // Styles for Tree Mode component

export default function TreeMode({ mode, switchMode }) {
    return (
        <div className="tree-mode">
            <button
                className={(mode === "all") ? "active-button" : undefined}
                onClick={() => switchMode("all")}
            >
                All
            </button>
            <button
                className={(mode === "owned") ? "active-button" : undefined}
                onClick={() => switchMode("owned")}
            >
                Owned
            </button>
            <button
                className={(mode === "tagged") ? "active-button" : undefined}
                onClick={() => switchMode("tagged")}
            >
                Tagged
            </button>
        </div>
    );
}