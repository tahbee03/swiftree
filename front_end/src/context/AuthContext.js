import { createContext, useReducer, useContext } from "react";

// Context
export const AuthContext = createContext();

export function authReducer(state, action) {
    switch(action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
}

// React component
export function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null
    });

    console.log(`AuthContext state: ${state}`);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
}

// Context hook
export function useAuthContext() {
    const context = useContext(AuthContext);

    if(!context) throw Error("useAuthContext must be inside an AuthContextProvider");

    return context;
}