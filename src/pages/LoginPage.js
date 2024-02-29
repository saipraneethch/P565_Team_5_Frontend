import React, { useState } from "react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import firebaseapp from "../firebase-config";
import ForgotPassword from "../pages/ForgotPassword"; // Adjust the path as necessary
import { useLogin } from "../hooks/useLogin";
import { useOAuthLogin } from "../hooks/useOAuthLogin";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Added state for modal visibility
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const {
    oauthlogin,
    isLoading: oauthIsLoading,
    error: oauthError,
  } = useOAuthLogin();

  const handleLogin = async (e) => {
    // Your login logic here
    await login(username, password);
    console.log(
      "Logging in with username:",
      username,
      "and password:",
      password
    );
  };
  const handleGoogleLogin = async (e) => {
    // Google login logic
    // from https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk
    const auth = getAuth(firebaseapp);

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;

        await oauthlogin(user.displayName, user.email);

        console.log("Google sign in successful", user);
      })
      .catch((error) => {
        // handle errors
        const errorCode = error.code;
        const errorMessage = error.message;

        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Google sign in error", errorCode, errorMessage);
      });
  };

  const handleFacebookLogin = () => {
    // Facebook login logic
    //docs: https://firebase.google.com/docs/auth/web/facebook-login
    const auth = getAuth(firebaseapp);
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;
        console.log(user);

        console.log("Google sign in successful", user);
      })
      .catch((error) => {
        // handle errors
        const errorCode = error.code;
        const errorMessage = error.message;

        // const email = error.customData.email;
        // const credential = FacebookAuthProvider.credentialFromError(error);
        console.error("Facebook sign in error", errorCode, errorMessage);
      });
  };

  const navigateToRegister = () => {
    navigate("/register");
  };
  const toggleForgotPassword = () => setShowForgotPassword(!showForgotPassword); // Toggle modal visibility

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={isLoading} onClick={handleLogin}>
        Login
      </button>
      {error && <div className="error">{error}</div>}


      <div className="social-login">
        <button disabled={oauthIsLoading} className="google-btn" onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} /> Login with Google
        </button>
        <button disabled={oauthIsLoading} className="facebook-btn" onClick={handleFacebookLogin}>
          <FontAwesomeIcon icon={faFacebook} /> Login with Facebook
        </button>
        {oauthError && <div className="error">{oauthError}</div>}
      </div>


      <button onClick={navigateToRegister}>Register</button>
      <button onClick={toggleForgotPassword}>Forgot Password?</button>{" "}
      {/* Added "Forgot Password?" button */}
      {showForgotPassword && (
        <ForgotPassword onClose={toggleForgotPassword} />
      )}{" "}
      {/* Conditionally render ForgotPassword */}
    </div>
  );
};
export default LoginPage;
