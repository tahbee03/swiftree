import { createContext } from "react"; // createContext()

// Context
export const ErrorContext = createContext();

// Reducer (defines actions done to update error info)
export function errorReducer(state, action) {
    switch(action.type) {
        case "SET":
            return { error: action.payload };
        case "RESET":
            return { error: null };
        default:
            return state;
    }
}