import { useReducer, useEffect } from "react";
import { authReducer, AuthContext } from "../contexts/AuthContext";

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (user) dispatch({ type: "LOGIN", payload: user });
    }, []);

    console.log(state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}