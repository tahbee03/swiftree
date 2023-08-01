import { useState } from 'react';
import { useEffect } from "react";
import "./PostTree.css";
import PostModal from './PostModal';
const _ = require("lodash");


function randomNum(min, max) {
    return (Math.random() * (max - min)) + min;
}

function createNodeList(bounds, num) {
    let arr = [{
        x: (bounds.right - bounds.left) / 2,
        y: (bounds.bottom - bounds.top) / 2,
        depth: 0
    }]; // Initialize with root node

    let count = 0; // Depth child count

    // TODO: Modify to ensure no two nodes have the same angle

    for (let i = 1; i <= num; i++) {
        let parent = arr[Math.floor((i - 1) / 2)];
        let depth = parent.depth + 1;
        let radius = depth * 50;

        if (arr[i - 1].depth !== depth) count = 0;
        let angle = randomNum(count * ((2 * Math.PI) / (Math.pow(2, depth))), (count + 1) * ((2 * Math.PI) / Math.pow(2, depth)));

        // maximum DCC: 2^depth
        // node partition: (2 * PI) / 2^depth

        arr.push({
            x: (radius * Math.cos(angle)) + ((bounds.right - bounds.left) / 2),
            y: (radius * Math.sin(angle)) + ((bounds.bottom - bounds.top) / 2),
            depth
        });

        count += 1;
    }

    return arr;
}

function createEdgeList(nodes, index) {
    let temp = [];
    let left = (2 * index) + 1;
    let right = (2 * index) + 2;

    if (left < nodes.length) {
        temp.push({
            x1: nodes[index].x,
            y1: nodes[index].y,
            x2: nodes[left].x,
            y2: nodes[left].y
        });

        temp.push(...createEdgeList(nodes, left));
    }

    if (right < nodes.length) {
        temp.push({
            x1: nodes[index].x,
            y1: nodes[index].y,
            x2: nodes[right].x,
            y2: nodes[right].y
        });

        temp.push(...createEdgeList(nodes, right));
    }

    return temp;
}

export default function PostTree({ posts, page }) {
    // TODO: Create a separate file to handle tree logic

    const [bounds, setBounds] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    });
    const [currentPost, setCurrentPost] = useState(null);
    const [visited, setVisited] = useState([]);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [modal, setModal] = useState(null);

    const createCanvas = () => {
        const canvas = document.getElementById("tree-canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        if (window.innerWidth >= 768) {
            if (canvas.getBoundingClientRect().height > canvas.getBoundingClientRect().width) canvas.style.height = canvas.getBoundingClientRect().width;
            else canvas.style.width = canvas.getBoundingClientRect().height;
        }

        setBounds({
            top: canvas.getBoundingClientRect().top,
            bottom: canvas.getBoundingClientRect().bottom,
            left: canvas.getBoundingClientRect().left,
            right: canvas.getBoundingClientRect().right
        });

        if (page === "home") canvas.style.backgroundColor = "white";
        else canvas.style.backgroundColor = "rgba(255, 255, 255, 0)";
    };

    const buildTree = () => {
        const n = createNodeList(bounds, posts.length);
        setNodes(n);
        setEdges(createEdgeList(n, 0));
    };

    // Run on mount
    useEffect(() => {
        createCanvas();

        // Event listeners
        document.getElementById("refresh").addEventListener("click", createCanvas);
        window.addEventListener("resize", createCanvas);

        // Cleans up event listeners when the component unmounts (?)
        return () => {
            window.removeEventListener("resize", createCanvas);
        };
    }, []);

    // Tree is built whenever the bounds state is updated i.e. whenever createCanvas() is called
    useEffect(() => {
        buildTree();
    }, [bounds]);

    function openModal(content) {
        if (!visited.includes(content._id)) setVisited([...visited, content._id]);
        setCurrentPost(content);
        setModal("post");
    }

    return (
        <>
            {(modal === "post") && (
                <PostModal modalState={{ modal, setModal }} content={currentPost} />
            )}
            <svg id="tree-canvas">
                {posts && (
                    <>
                        {edges && edges.map((e, i) => (
                            <line
                                className="tree-edge"
                                key={i}
                                x1={e.x1}
                                y1={e.y1}
                                x2={e.x2}
                                y2={e.y2}
                            />
                        ))}
                        {nodes && nodes.slice(1).map((n, i) => (
                            <circle
                                key={i}
                                className="tree-node"
                                cx={n.x}
                                cy={n.y}
                                r="10"
                                stroke="black"
                                strokeWidth="3"
                                fill={(posts[i] && visited.includes(posts[i]._id)) ? "#A532FF" : "white"}
                                onMouseEnter={(e) => { e.target.setAttribute("r", "20") }}
                                onMouseLeave={(e) => { e.target.setAttribute("r", "10") }}
                                onClick={() => openModal(posts[i])}
                            />
                        ))}
                        <circle
                            className="tree-node"
                            cx={(bounds.right - bounds.left) / 2}
                            cy={(bounds.bottom - bounds.top) / 2}
                            r="25"
                            stroke="black"
                            strokeWidth="3"
                            fill="#A532FF"
                        />
                        <image
                            id="refresh"
                            href="/refresh.png"
                            x={((bounds.right - bounds.left) / 2) - 25}
                            y={((bounds.bottom - bounds.top) / 2) - 25}
                            width="50"
                            height="50"
                        />
                    </>
                )}
            </svg>
        </>
    );
}

// https://youtu.be/nnRZBuLjhDY
// https://www.w3schools.com/js/js_random.asp
// https://www.goldencreche.com/blog/functions-in-dependency-array-of-useeffect
// https://react.dev/reference/react/useCallback