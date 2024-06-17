import { useReducer, useEffect } from "react"; // useReducer(), useEffect()
import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()
import { notifReducer, NotifContext } from "../contexts/NotifContext"; // notifReducer(), NotifContext
import { handleError } from "../utils"; // handleError()

export default function NotifContextProvider({ children }) {
    const [state, dispatch] = useReducer(notifReducer, { notifications: [] });
    const { user } = useAuthContext(); // Contains data for logged in user

    // Runs when user value is updated
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`);
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.message);
                    else dispatch({ type: "SET", payload: data.filter((notif) => (notif.user_id === user.id)) }); // Filter notifications to match logged in user
                }
            } catch (error) {
                console.log(handleError(error));
            }
        };

        fetchData();
    }, [user]);

    return (
        <NotifContext.Provider value={{ ...state, dispatch }}>
            {children}
        </NotifContext.Provider>
    );
}