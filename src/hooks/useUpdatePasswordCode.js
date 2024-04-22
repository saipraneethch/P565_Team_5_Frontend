import { useState } from "react";

export const useUpdatePasswordCode = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);


  const updatePassCode = async (code) => {
    setIsLoading(true);
    setError(null);
    setIsVerified(false); // Reset verification status


    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/v1/update-password-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify({ activation_code: code }), 
      });

      const json = await response.json();
      console.log("hi")
      console.log(json)

      if (!response.ok) {
        //const json = await response.json();
        
        setError(json.message || "Failed to verify code.");
      } else {
        setIsVerified(true); // Set verification success
      }
    } catch (error) {
      setError("Activation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassCode, isLoading, error , isVerified };
};
