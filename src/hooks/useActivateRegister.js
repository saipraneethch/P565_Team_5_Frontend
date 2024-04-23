import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useActivateRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const activate = async (otp) => {
    setIsLoading(true);
    setError(null);

    // Retrieve the stored activation token
    const activationToken = localStorage.getItem('activationToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/activate-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activationToken}`  // Send the activation token in headers
        },
        body: JSON.stringify({ activation_code: otp })
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        // Assuming the server response contains the user data after successful activation
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json }); // Update auth context
      }
    } catch (error) {
      setError("Activation failed. Please try again."); // Handle network errors or other unexpected errors
    }

    setIsLoading(false);
  };

  return { activate, isLoading, error };
};
