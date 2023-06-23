import { useState } from "react";
import { useAuthContext } from "./AuthContext";

export function useSignUp() {
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    async function signUp(email, username, password) {
        setIsLoading(true);
        // setError(null);

        const res = await fetch("/api/users/sign-up", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, username, password})
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