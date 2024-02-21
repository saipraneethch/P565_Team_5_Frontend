import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

// This function decides how to update the user's login state based on actions.
export const authReducer = (state, action) => {
    // Look at the action type to decide what to do.
    switch (action.type) {
        case 'LOGIN': // If the action is LOGIN,
            // Update the state to include the user's information.
            return { user: action.payload };
        case 'LOGOUT': // If the action is LOGOUT,
            // Clear the user's information from the state.
            return { user: null };
        default: // If the action doesn't match anything,
            // Don't change the state.
            return state;
    }
};


export const AuthContextProvider = ({ children }) => {
    // Set up the state for authentication and a way to update it (dispatch).
    const [state, dispatch] = useReducer(authReducer, {
        user: null, // Start with no user logged in.
    });

    // Run this code once the component mounts.
    useEffect(() => {
        // Try to get the user's data from the browser's local storage.
        const user = JSON.parse(localStorage.getItem('user'));

        // If there's user data, log the user in automatically.
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []); // The empty array means this effect runs only once after the initial render.

    // Show what the current auth state looks like in the console (for debugging).
    console.log('AuthContext.state: ', state);

    // Provide the auth state and a way to update it (dispatch) to all components inside AuthContext.Provider.
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children} {/* Render child components passed into this provider */}
        </AuthContext.Provider>
    );
};
