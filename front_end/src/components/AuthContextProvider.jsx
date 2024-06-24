import { useReducer, useEffect } from "react"; // useReducer(), useEffect()
import { authReducer, AuthContext } from "../contexts/AuthContext"; // authReducer(), AuthContext
import { handleError } from "../utils"; // handleError()

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        // NOTE: User data is initially grabbed from the browser's session storage since that data is unique to the user
        // that is logged in. Updating the context with data from the back-end is done afterwards to ensure the data
        // is updated for the same user.

        const user = JSON.parse(sessionStorage.getItem("user")); // Get user data from browser storage

        if (user) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`);
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.message);

                    // NOTE: The ID and token are assumed to remain constant since they cannot be changed.
                    const newData = {
                        id: user.id,
                        email: data.email,
                        username: data.username,
                        display_name: data.display_name,
                        pfp: data.image.url,
                        friends: data.friends,
                        token: user.token
                    };

                    dispatch({ type: "LOGIN", payload: newData }); // Update user context
                } catch (error) {
                    console.log(handleError(error));
                }
            };

            fetchData(); // Fetch data from back-end to ensure user data is up-to-date
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}