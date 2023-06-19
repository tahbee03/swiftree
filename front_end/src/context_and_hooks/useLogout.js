import { useAuthContext } from "./AuthContext";

export function useLogout() {

    const {dispatch} = useAuthContext();

    function logout() {
        localStorage.removeItem("user"); // Remove user from browser local storage
        dispatch({type: "LOGOUT"}); // Dispatch logout action and update AuthContext
    }

    return { logout };

}