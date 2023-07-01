import { useState } from 'react';
import { useEffect } from "react";
import "./PostTree.css";
import Post from "../components/Post";

export default function PostTree({ posts }) {
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


    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Run on mount
    useEffect(() => {
        const canvasRect = document.getElementById("tree-canvas").getBoundingClientRect();

        setBounds({
            top: canvasRect.top,
            bottom: canvasRect.bottom,
            left: canvasRect.left,
            right: canvasRect.right
        });
    }, []);

    // Run when posts prop or bounds state is updated
    useEffect(() => {
        const createNodeList = (num) => {
            let arr = [{
                x: (bounds.right - bounds.left) / 2,
                y: (bounds.bottom - bounds.top) / 2
            }]; // Initialize with root node

            for (let i = 0; i < num; i++) {
                arr.push({
                    x: randomNum(0, bounds.right - bounds.left),
                    y: randomNum(0, bounds.bottom - bounds.top)
                });
            }

            return arr;
        };

        if (posts && posts.length > 0) setNodes(createNodeList(posts.length));
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

    return (
        <>
            <div id="post-modal">
                <div id="modal-content">
                    <div id="close" onClick={closeModal}>&times;</div>
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
                                r="15"
                                stroke="black"
                                strokeWidth="3"
                                fill={(posts[i] && visited.includes(posts[i]._id)) ? "#A532FF" : "white"}
                                onMouseEnter={(e) => { e.target.setAttribute("r", "25") }}
                                onMouseLeave={(e) => { e.target.setAttribute("r", "15") }}
                                onClick={() => openModal(posts[i])}
                            />
                        ))}
                        <circle
                            className="tree-node"
                            cx={(bounds.right - bounds.left) / 2}
                            cy={(bounds.bottom - bounds.top) / 2}
                            r="30"
                            stroke="black"
                            strokeWidth="3"
                            fill="#A532FF"
                        />
                    </>
                )}
            </svg>
        </>
    );
}

// https://youtu.be/nnRZBuLjhDY
// https://www.w3schools.com/js/js_random.asp