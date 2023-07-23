import { useAuthContext } from "../hooks/useAuthContext"; // useAuthContext()

export function useLogout() {
    const { dispatch } = useAuthContext(); // Gives the hook the ability to update the logged in user's info

    function logout() {
        sessionStorage.removeItem("user"); // Removes user from browser local storage
        dispatch({type: "LOGOUT"}); // Dispatches logout action and updates AuthContext
    }

    return { logout };

}