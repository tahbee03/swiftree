import { createContext } from "react"; // createContext()

export const NotifContext = createContext();

export function notifReducer(state, action) {
    if (action.type === "SET") return { notifications: action.payload };
    else return state;
}