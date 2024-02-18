
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";


export const useRegister = () => {
  // State for managing error messages.
  const [error, setError] = useState(null);
  // State for tracking whether the register process is loading.
  const [isLoading, setIsLoading] = useState(null);
  // Destructure dispatch from the useAuthContext to update global auth state.
  const { dispatch } = useAuthContext();

  // Define the register function that takes first_name,last_name, username,email, and password as arguments.
  const register = async (first_name,last_name, username,email, password) => {
    // Set loading to true when the register process starts.
    setIsLoading(true);
    // Reset any existing errors to null.
    setError(null);

    // Make a POST request to the register API endpoint.
    const response = await fetch('/api/v1/registration', {
      method: 'POST',
      body: JSON.stringify({ first_name,last_name, username,email, password }), // Convert the user data to a JSON string.
      headers: {
        'Content-Type': 'application/json' // Specify the content type in the headers.
      }
    });

    // Parse the JSON response from the server.
    const json = await response.json();

    // Check if the response was not ok (e.g., register failure).
    if (!response.ok) {
      // Set the error state to the error message from the response.
      setError(json.error);
      // Set loading to false as the register process has ended.
      setIsLoading(false);
    }

    // If the response was ok (register success).
    if (response.ok) {
      // Save the user data to local storage for session persistence.
      localStorage.setItem('user', JSON.stringify(json));

      // Update the global authentication context to reflect that the user is logged in.
      dispatch({ type: 'LOGIN', payload: json });

      // Set loading to false as the register process has ended.
      setIsLoading(false);
      // Reset any errors to null.
      setError(null);
      // Log a message to the console indicating successful login.
      console.log("User logged in.", json);
    }
  };

  // Return the register function and state variables from the hook for use in components.
  return { register, isLoading, error };
}
