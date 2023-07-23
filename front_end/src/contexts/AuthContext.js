import { createContext } from "react"; // createContext()

// Context
export const AuthContext = createContext();

// Reducer (defines actions done to update user info)
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