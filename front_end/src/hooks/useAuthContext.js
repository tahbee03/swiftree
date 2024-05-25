import { useContext } from "react"; // useContext()
import { AuthContext } from "../contexts/AuthContext"; // AuthContext

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuthContext must be inside an AuthContextProvider!");
    else return context; // Returns context to be accessed in pages and components
}