/**
 * Function used to pause execution for a specific amount of time
 * 
 * @async @function
 * @param {number} sec - Number of seconds to wait
 * @returns {Promise} A Promise object (negligible)
 */
export async function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

/**
 * Function used to group a list of items into fixed partitions
 * 
 * @function
 * @param {Array} arr - List of elements to be partitioned
 * @param {number} size - Size of each partition
 * @returns {Object.<number, Array>} Object containing key-value pairs of each partition
 */
export function partition(arr, size) {
    // arr -> array of content (posts)
    // size -> size of partition (14)

    // [0...13], [14...27], [28...41], ...

    let p = {}; // Object to store array partitions as key-value pairs
    for (let i = 1; ((i - 1) * size) < arr.length; i++) {

        // For loop condition checks if ((i - 1) * size) is less than arr.length
        // since those will already be counted for

        // It is also checked if (i * size) is greater than arr.length within
        // the for loop to avoid going out of range when slicing

        p[i] = ((i * size) > arr.length) ? arr.slice((i - 1) * size) : arr.slice((i - 1) * size, (i * size));
    }

    return p;
}

/**
 * Function to conditionally return error message
 * 
 * @function
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
export function handleError(error) {
    console.log(error);
    return ((error.message === "Failed to fetch") ? "Failed to connect to server. Please try again later." : error.message);
}

/**
 * Function to change password visibility and icon image
 * 
 * @function
 * @param {Event} e - Detected event
 * @param {string} id - ID of element to toggle
 */
export function handlePasswordToggle(e, id) {
    // Changes the image for the toggler accordingly
    const toggler = e.target;
    if (toggler.src === `${window.location.origin}/hide.png`) toggler.src = `${window.location.origin}/visible.png`;
    else toggler.src = `${window.location.origin}/hide.png`;

    // Changes the visibility of the password input accordingly
    const passwordInput = document.getElementById(id);
    if (passwordInput.type === "password") passwordInput.type = "text";
    else passwordInput.type = "password";
}

/**
 * Function that returns a random number between a given range
 * 
 * @function
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number}
 */
export function randomNum(min, max) {
    // Math.random() ----------------------> generate random number in the range [0, 1)
    // (max - min) ------------------------> size of range
    // Math.random() * (max - min) --------> scale so that the range is [0, (max - min))
    // Math.random() * (max - min)) + min -> shift so that the range is [min, max)

    return (Math.random() * (max - min)) + min;
}

/**
 * Function that creates a list of nodes
 * 
 * @function
 * @param {{top: number, bottom: number, left: number, right: number}} bounds - Boundary coordinates
 * @param {number} num - Number of nodes to create
 * @returns {[{x: number, y: number, depth: number}]} List of nodes
 */
export function createNodeList(bounds, num) {
    let nodes = [{
        x: (bounds.right - bounds.left) / 2,
        y: (bounds.bottom - bounds.top) / 2,
        depth: 0
    }]; // Initialize with root node

    let count = 0; // Depth child count

    for (let i = 1; i <= num; i++) {
        let parent = nodes[Math.floor((i - 1) / 2)];
        let depth = parent.depth + 1;
        let radius = depth * 50; // Scale so that nodes of consecutive depths are 50 pixels apart

        if (nodes[i - 1].depth !== depth) count = 0; // Reset node count when a new depth is reached
        let piece = (2 * Math.PI) / (Math.pow(2, depth)); // Angle partition with respect to each depth
        let angle = randomNum(count * piece, (count + 1) * piece); // Scale angle partition accordingly for each node in the depth

        nodes.push({
            x: (radius * Math.cos(angle)) + ((bounds.right - bounds.left) / 2),
            y: (radius * Math.sin(angle)) + ((bounds.bottom - bounds.top) / 2),
            depth
        });

        count += 1;
    }

    return nodes;
}

/**
 * Function that creates a list of edges
 * 
 * @function
 * @param {[{x: number, y: number, depth: number}]} nodes - List of nodes
 * @param {number} index - Current node index
 * @returns {[{x1: number, y1: number, x2: number, y2: number}]} - List of edges
 */
export function createEdgeList(nodes, index) {
    let edges = [];
    let left = (2 * index) + 1; // Index of left child node
    let right = (2 * index) + 2; // Index of right child node

    // NOTE: Each node is visited recursively using a postorder traversal (left -> right -> root)

    if (left < nodes.length) {
        // Connect current node to left child node
        edges.push({
            x1: nodes[index].x,
            y1: nodes[index].y,
            x2: nodes[left].x,
            y2: nodes[left].y
        });

        // Recursively call function on left subtree
        edges.push(...createEdgeList(nodes, left));
    }

    if (right < nodes.length) {
        // Connect current node to right child node
        edges.push({
            x1: nodes[index].x,
            y1: nodes[index].y,
            x2: nodes[right].x,
            y2: nodes[right].y
        });

        // Recursively call function on right subtree
        edges.push(...createEdgeList(nodes, right));
    }

    return edges;
}