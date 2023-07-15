import { createContext, useReducer, useContext } from "react";

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

// React component
export function ErrorContextProvider({ children }) {
    const [state, dispatch] = useReducer(errorReducer, {
        error: null
    });

    return (
        <ErrorContext.Provider value={{...state, dispatch}}>
            { children }
        </ErrorContext.Provider>
    );
}

// Context hook
export function useErrorContext() {
    return useContext(ErrorContext);
}