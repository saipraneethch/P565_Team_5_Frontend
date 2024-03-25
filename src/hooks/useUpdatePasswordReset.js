import { useState } from "react";

export const useUpdatePasswordReset = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const updatePassReset = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setIsReset(false); // Reset the success status before each attempt

    try {
      const response = await fetch('/api/v1/update-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }), 
      });
  
      setIsLoading(false); // Update loading state
  
      if (!response.ok) {
        const json = await response.json();
        setError(json.message || "Password reset failed. Please try again.");
        return false; // Indicate failure
      } else {
        setIsReset(true); // Update success state
        return true; // Indicate success
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
      return false; // Indicate failure
    }
  };

  return { updatePassReset, isLoading, error, isReset };
};
