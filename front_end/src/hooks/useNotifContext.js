import { useContext } from "react"; // useContext()
import { NotifContext } from "../contexts/NotifContext"; // NotifContext

export function useNotifContext() {
    const context = useContext(NotifContext);

    if (!context) throw new Error("useNotifContext must be inside a NotifContextProvider!");
    else return context;
}