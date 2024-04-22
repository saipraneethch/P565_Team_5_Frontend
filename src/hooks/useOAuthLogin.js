import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useOAuthLogin = () => {
  const [error, setError] = useState(null); // State for managing error messages.
  const [isLoading, setIsLoading] = useState(false); // State for tracking whether the register process is loading, correctly initialized to false.
  const { dispatch } = useAuthContext();

  const oauthlogin = async (displayName, email) => {
    setIsLoading(true); // Set loading to true when the register process starts.
    setError(null); // Reset any existing errors to null.

    console.log(displayName, email);
    let nameParts = displayName.split(" "); // This splits the string into an array by space
    let first_name = nameParts[0]; // This assigns the first part (first name) to first_name
    let last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""; // This joins the remaining parts (last name) back into a string

    let username = displayName.replace(/\s+/g, "").toLowerCase();

    try {
      // Make a POST request to the oauth API endpoint.
      const response = await fetch("${process.env.REACT_APP_API_URL}/api/v1/oauth", {
        method: "POST",
        body: JSON.stringify({ first_name, last_name, username, email }), // Convert the user data to a JSON string.
        headers: {
          "Content-Type": "application/json", // Specify the content type in the headers.
        },
      });

      const json = await response.json(); // Parse the JSON response from the server.

      if (!response.ok) {
        setError(json.message || "Some error occurred. Please try again"); // Set the error state to the error message from the response.
        setIsLoading(false); // Set loading to false as the register process has ended.
        return false; // Indicate failure to register
      }

      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      setError(null);
      console.log("User logged in:", json);

      setIsLoading(false); // Ensure loading is set to false on success
      return true; // Indicate successful registration
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setIsLoading(false);
    }
  };

  return { oauthlogin, isLoading, error }; // Return the register function and state variables from the hook for use in components.
};
