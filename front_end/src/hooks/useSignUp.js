import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { useNotify } from "./useNotify"; // useNotify()

export function useSignUp() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info
    const notify = useNotify(); // Custom hook to create a new notification

    async function signUp(email, username, displayName, password) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/sign-up`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, display_name: displayName, password })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message); // Throws error to be displayed on page (Sign Up)

        sessionStorage.setItem("user", JSON.stringify(data)); // Stores user in browser session storage
        dispatch({ type: "LOGIN", payload: data }); // Dispatches login action and updates AuthContext

        notify(data.id, `Welcome to swiftree, ${data.username}!`, "/swiftree_logo.png"); // Welcome users that successfully create an account
    }

    return signUp;
}