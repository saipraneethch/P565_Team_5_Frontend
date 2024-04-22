import { useState } from "react";


export const useUpdatePasswordEmail = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSent, setIsUpdateSent] = useState(false); // New state to track if the update was sent
  

  const updatePassEmail = async (email) => {
    setIsLoading(true);
    setError(null);
    setIsUpdateSent(false); // Reset update sent status on new request

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/update-password-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message || "Failed to send OTP");
    } else {
      setIsUpdateSent(true); // Set update sent to true on successful response
    }

    setIsLoading(false);
  };

  return { updatePassEmail, isLoading, error, isUpdateSent }; // Include isUpdateSent in the returned object
};
