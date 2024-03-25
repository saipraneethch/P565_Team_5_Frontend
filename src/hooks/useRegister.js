import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
  const [error, setError] = useState(null); // State for managing error messages.
  const [isLoading, setIsLoading] = useState(false); // State for tracking whether the register process is loading, correctly initialized to false.
  const { dispatch } = useAuthContext(); // Destructure dispatch from the useAuthContext to update global auth state.

  const resetError = () => setError(null); // Function to reset error

  const register = async (first_name, last_name, username, email, password) => {
    setIsLoading(true); // Set loading to true when the register process starts.
    setError(null); // Reset any existing errors to null.

    // Make a POST request to the register API endpoint.
    const response = await fetch('/api/v1/registration', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, username, email, password }), // Convert the user data to a JSON string.
      headers: {
        'Content-Type': 'application/json' // Specify the content type in the headers.
      }
    });

    const json = await response.json(); // Parse the JSON response from the server.

    if (!response.ok) {
      setError(json.message || "Some error occurred. Please try again"); // Set the error state to the error message from the response.
      setIsLoading(false); // Set loading to false as the register process has ended.
      return false; // Indicate failure to register
    }

    // Optionally, update auth context or perform other success actions here

    setIsLoading(false); // Ensure loading is set to false on success
    return true; // Indicate successful registration
  };

  return { register, isLoading, error, resetError }; // Return the register function and state variables from the hook for use in components.
};
