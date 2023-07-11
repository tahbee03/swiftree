import { useState } from "react";
import { useAuthContext } from "./AuthContext";
// require("dotenv").config();

export function useSignUp() {
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    async function signUp(email, username, displayName, password) {
        setIsLoading(true);
        // setError(null);

        const res = await fetch(`${process.env.API_URL}/users/sign-up`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, username, display_name: displayName, password})
        });
        const data = await res.json();

        if(!res.ok) {
            setIsLoading(false);
            // setError(data.error);
            throw Error(data.error);
        } else {
            sessionStorage.setItem("user", JSON.stringify(data)); // Store user in browser local storage
            dispatch({type: "LOGIN", payload: data}); // Dispatch login action and update AuthContext
            setIsLoading(false);
        }
    }

    return { signUp, isLoading };
}