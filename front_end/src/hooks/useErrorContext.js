import { useContext } from "react";
import { ErrorContext } from "../contexts/ErrorContext";

export function useErrorContext() {
    const context = useContext(ErrorContext);

    if(!context) throw Error("useErrorContext must be inside an ErrorContextProvider!");

    return context;
}