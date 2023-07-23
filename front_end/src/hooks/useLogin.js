import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export function useLogin() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info

    async function login(username, password) {
        // Processes input in back-end
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();

        if(!res.ok) {
            throw Error(data.error); // Throws error to be displayed on page (Login)
        } else {
            sessionStorage.setItem("user", JSON.stringify(data)); // Stores user in browser session storage
            dispatch({type: "LOGIN", payload: data}); // Dispatches login action and updates AuthContext
        }
    }

    return { login };
}