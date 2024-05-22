import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export function useSignUp() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info

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
    }

    return signUp;
}