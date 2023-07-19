import { useAuthContext } from "../contexts/AuthContext"; // useAuthContext()

export function useSignUp() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info

    async function signUp(email, username, displayName, password) {
        // Processes input in back-end
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/sign-up`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, username, display_name: displayName, password})
        });
        const data = await res.json();

        if(!res.ok) {
            throw Error(data.error); // Throws error to be displayed on page (Sign Up)
        } else {
            sessionStorage.setItem("user", JSON.stringify(data)); // Stores user in browser session storage
            dispatch({type: "LOGIN", payload: data}); // Dispatches login action and updates AuthContext
        }
    }

    return { signUp };
}