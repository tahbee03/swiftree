import "./PostTree.css"; // Styles for Post Tree component

import PostModal from "./PostModal"; // <PostModal />

import { useState, useEffect } from "react"; // useState(), useEffect()
import { createNodeList, createEdgeList } from "../utils"; // createNodeList(), createEdgeList()

export default function PostTree({ posts, page }) {
    const [bounds, setBounds] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Bounding coordinates of the canvas
    const [currentPost, setCurrentPost] = useState(null); // Contains the data for the selected post
    const [visited, setVisited] = useState([]); // State that keeps track of the nodes that were opened
    const [nodes, setNodes] = useState([]); // State that stores the list of nodes to be rendered
    const [edges, setEdges] = useState([]); // State that stores the list of edges to be rendered
    const [modal, setModal] = useState(null); // Used to determine when the modal should be displayed

    // Runs when posts are updated
    useEffect(() => {
        const createCanvas = () => {
            const canvas = document.getElementById("tree-canvas");

            // STEP 1: Set the width and height of the canvas to match that of the parent element
            canvas.style.width = "100%";
            canvas.style.height = "100%";

            // STEP 2: If the window width is greater than or equal to 768 px (Bootstrap md breakpoint), clip the larger length so that the canvas forms a square
            if (window.innerWidth >= 768) {
                if (canvas.getBoundingClientRect().height > canvas.getBoundingClientRect().width) canvas.style.height = canvas.getBoundingClientRect().width;
                else canvas.style.width = canvas.getBoundingClientRect().height;
            }

            const b = {
                top: canvas.getBoundingClientRect().top,
                bottom: canvas.getBoundingClientRect().bottom,
                left: canvas.getBoundingClientRect().left,
                right: canvas.getBoundingClientRect().right
            };

            // STEP 3: Store the bounding coordinates in the state
            setBounds(b);

            // STEP 4: Use the bounds to create the tree nodes and edges
            const n = createNodeList(b, posts.length);
            setNodes(n);
            const e = createEdgeList(n, 0);
            setEdges(e);
        };

        createCanvas();

        // Event listeners
        document.getElementById("refresh").addEventListener("click", createCanvas);
        window.addEventListener("resize", createCanvas);

        // Cleans up event listeners when the component unmounts
        return () => {
            // NOTE: The element with ID '#refresh' doesn't need to be included since it gets removed from the DOM
            window.removeEventListener("resize", createCanvas);
        };
    }, [posts]);

    // Helper function that updates the list of visited nodes and opens the post modal
    function openModal(content) {
        if (!visited.includes(content._id)) setVisited([...visited, content._id]);
        setCurrentPost(content);
        setModal("post");
    }

    // Checks if a post contains a tag so that it can be conditionally colored
    function hasTag(post) {
        /*
        criteria:
        - the post needs to exist
        - the tag needs to be in a specific format -> tagPattern.test(post.content)
        - has to be on the profile page -> pathPattern.test(path)
        - tag needs to be specific to the user currently being displayed -> post.content.match(tagPattern).includes(`@${path.substring(9)}`)
        */

        const tagPattern = /@[a-z0-9._]+/g;
        const pathPattern = /\/profile\/.+/g;
        const path = window.location.pathname;

        if (post) return tagPattern.test(post.content) && pathPattern.test(path) && post.content.match(tagPattern).includes(`@${path.substring(9)}`);
    }

    return (
        <>
            {(modal === "post") && (
                <PostModal setModal={setModal} post={currentPost} />
            )}
            <svg id="tree-canvas" className={(page === "home") ? "home" : undefined}>
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
                                stroke={(hasTag(posts[i])) ? "#fce762" : "black"}
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