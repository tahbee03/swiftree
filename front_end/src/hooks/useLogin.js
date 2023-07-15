import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
// require("dotenv").config();

export function useLogin() {
    // const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    async function login(username, password) {
        setIsLoading(true);
        // setError(null);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
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

    return { login, isLoading };
}