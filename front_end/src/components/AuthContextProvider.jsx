import { useReducer, useEffect } from "react"; // useReducer(), useEffect()
import { authReducer, AuthContext } from "../contexts/AuthContext"; // authReducer(), AuthContext

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user")); // Get user data from browser storage

        if (user) dispatch({ type: "LOGIN", payload: user }); // Update user context
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}