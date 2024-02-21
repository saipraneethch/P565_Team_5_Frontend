
import { AuthContext } from "../context/authContext";

import { useContext } from "react";


export const useAuthContext = () => {
    // Use the useContext hook with AuthContext to get the current context value.
    const context = useContext(AuthContext);

    // Check if the context is not available (i.e., undefined).
    if (!context) {
        // If context is not available, it means this hook is being used outside of an AuthContextProvider.
        // Throw an error to indicate that useAuthContext must be used within an AuthContextProvider.
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }

    // If the context is available, return it.
    // This allows any component that uses this hook to access the auth state and functions.
    return context;
}
