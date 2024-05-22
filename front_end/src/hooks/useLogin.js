import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export function useLogin() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info

    async function login(username, password) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message); // Throws error to be displayed on page (Login)

        sessionStorage.setItem("user", JSON.stringify(data)); // Stores user in browser session storage
        dispatch({ type: "LOGIN", payload: data }); // Dispatches login action and updates AuthContext
    }

    return login;
}