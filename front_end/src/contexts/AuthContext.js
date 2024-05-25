import { createContext } from "react"; // createContext()

// Context -> data that can be accessed in any component
export const AuthContext = createContext();

// Reducer -> defines actions done to update user info
export function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload }; // Update user object with received data
        case "LOGOUT":
            return { user: null }; // Remove user data
        case "UPDATE":
            return { user: action.payload }; // Update user object with received data
        default:
            return state; // Return existing data if unknown action is passed in
    }
}