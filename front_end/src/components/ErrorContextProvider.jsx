import { useReducer } from "react";
import { ErrorContext, errorReducer } from "../contexts/ErrorContext";

export default function ErrorContextProvider({ children }) {
    const [state, dispatch] = useReducer(errorReducer, {
        error: null
    });

    return (
        <ErrorContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ErrorContext.Provider>
    );
}