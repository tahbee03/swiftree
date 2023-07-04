import { useState } from 'react';
import { useEffect } from "react";
import "./PostTree.css";
import Post from "../components/Post";
const _ = require("lodash");

export default function PostTree({ posts }) {
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

    // Run on mount
    useEffect(() => {
        const canvas = document.getElementById("tree-canvas");

        if (window.innerWidth < 576) canvas.style.width = "100%";
        else canvas.style.width = canvas.getBoundingClientRect().height;

        setBounds({
            top: canvas.getBoundingClientRect().top,
            bottom: canvas.getBoundingClientRect().bottom,
            left: canvas.getBoundingClientRect().left,
            right: canvas.getBoundingClientRect().right
        });
    }, []);

    // Run when posts prop or bounds state is updated
    useEffect(() => {
        const randomNum = (min, max) => {
            return (Math.random() * (max - min)) + min;
        };

        const createNodeList = (num) => {
            let arr = [{
                x: (bounds.right - bounds.left) / 2,
                y: (bounds.bottom - bounds.top) / 2,
                depth: 0
            }]; // Initialize with root node

            let count = 0; // Depth child count

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
        };

        const initialBounds = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };

        if (posts.length > 0 && !_.isEqual(bounds, initialBounds)) setNodes(createNodeList(posts.length));
    }, [posts, bounds]);

    // Run when nodes state is updated
    useEffect(() => {
        const createEdgeList = (nodes, index) => {
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
        };

        setEdges(createEdgeList(nodes, 0));
    }, [nodes]);

    function openModal(postData) {
        if (!visited.includes(postData._id)) setVisited([...visited, postData._id]);
        setCurrentPost(postData);
        document.getElementById("post-modal").style.display = "block";
    }

    function closeModal() {
        document.getElementById("post-modal").style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        const postModal = document.getElementById("post-modal");
        if (event.target === postModal) {
            postModal.style.display = "none";
        }
    }

    window.addEventListener("resize", () => {
        const canvas = document.getElementById("tree-canvas");

        if (window.innerWidth < 576) canvas.style.width = "100%";
        else canvas.style.width = canvas.getBoundingClientRect().height;
    });

    return (
        <>
            <div id="post-modal">
                <div className="modal-content">
                    <div className="close" onClick={closeModal}>&times;</div>
                    {currentPost && (
                        <Post post={currentPost} />
                    )}
                </div>
            </div>
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
                            onClick={() => window.location.reload()}
                        />
                    </>
                )}
            </svg>
        </>
    );
}

// https://youtu.be/nnRZBuLjhDY
// https://www.w3schools.com/js/js_random.asp
// TODO: Find a way to not have the edges overlap