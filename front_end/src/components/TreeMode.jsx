import "./TreeMode.css"; // Styles for Tree Mode component

export default function TreeMode({ mode, switchMode, options }) {
    return (
        <div className="tree-mode">
            {options.map((o, i) => (
                <button
                    className={(mode === o) ? "active-button" : undefined}
                    onClick={() => switchMode(o)}
                    key={i}
                >
                    {o.toUpperCase()}
                </button>
            ))}
        </div>
    );
}