import { useContext } from "react"; // useContext()
import { ErrorContext } from "../contexts/ErrorContext"; // ErrorContext

export function useErrorContext() {
    const context = useContext(ErrorContext);

    if(!context) throw Error("useErrorContext must be inside an ErrorContextProvider!");

    return context; // Returns context to be accessed in pages and components
}