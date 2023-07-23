import { createContext } from "react";

// Context
export const AuthContext = createContext();

// Reducer
export function authReducer(state, action) {
    switch(action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        case "UPDATE":
            return { user: action.payload };
        default:
            return state;
    }
}