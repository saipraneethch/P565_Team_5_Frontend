import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
 const [error, setError] = useState(null)
 const [isLoading, setIsLoading] = useState(null)
 const {dispatch} = useAuthContext()

 const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/login-user`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response)
    
    
    try {
        if (!response.ok) {
            const json = await response.json();
            console.log('Error:', json.error);
            setError(json.error);
            setIsLoading(false);
        } else {
            const json = await response.json();
            
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
            setError(null);
            console.log('User logged in:', json);
        }
    } catch (error) {
        console.error('Network error:', error);
        setError('Network error. Please try again.');
        setIsLoading(false);
    }
    
 }

 return { login, isLoading, error}
}