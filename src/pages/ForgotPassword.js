import React, { useState, useEffect } from "react";
import { useUpdatePasswordEmail } from "../hooks/useUpdatePasswordEmail";
import { useUpdatePasswordCode } from "../hooks/useUpdatePasswordCode";
import { useUpdatePasswordReset } from "../hooks/useUpdatePasswordReset";
import '../index.css';
// Import any other necessary components or libraries

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    updatePassEmail,
    isLoading: isLoadingUpdatePassEmail,
    error: errorUpdatePassEmail,
    isUpdateSent,
  } = useUpdatePasswordEmail();

  const {
    updatePassCode,
    isLoading: isLoadingUpdateCode,
    error: errorUpdateCode,
    isVerified,
  } = useUpdatePasswordCode();

  const {
    updatePassReset,
    isLoading: isLoadingUpdateReset,
    error: errorUpdateReset,
    isReset,
  } = useUpdatePasswordReset();

  useEffect(() => {
    if (isUpdateSent) {
      setStep(2);
    }
  }, [isUpdateSent]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    await updatePassEmail(email);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    await updatePassCode(code);
    // No need to explicitly setStep here; useEffect will handle it based on isVerified
  };

  // Use useEffect to transition to the next step when OTP verification is successful
  useEffect(() => {
    if (isVerified) {
      setStep(3);
    }
  }, [isVerified]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const resetSuccessful = await updatePassReset(email, newPassword); // Wait for the promise

    if (resetSuccessful) {
      onClose(); // Close the modal on success
    } else {
      console.error("Failed to reset password"); // Show an error message on failure
    }
  };

  return (
    <div className="forgot-password-modal">
      {/* Conditional rendering based on the step */}
      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendCode} disabled={isLoadingUpdatePassEmail}>
            Send Code
          </button>
          {errorUpdatePassEmail && (
            <div className="error">{errorUpdatePassEmail}</div>
          )}
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerifyCode} disabled={isLoadingUpdateCode}>
            Verify Code
          </button>
          {errorUpdateCode && <div className="error">{errorUpdateCode}</div>}
        </div>
      )}
      {step === 3 && (
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={isLoadingUpdateReset}>
            Change Password
          </button>
          {errorUpdateReset && <div className="error">{errorUpdateReset}</div>}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
