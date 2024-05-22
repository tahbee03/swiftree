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