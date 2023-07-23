import { createContext } from "react";

// Context
export const ErrorContext = createContext();

// Reducer
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