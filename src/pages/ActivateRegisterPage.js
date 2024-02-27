import React, { useState } from 'react';
import { useActivateRegister } from '../hooks/useActivateRegister'; 

const ActivateRegisterPage = () => {
  const [otp, setOtp] = useState('');
  const { activate, isLoading, error } = useActivateRegister();

  const handleSubmit = (event) => {
    event.preventDefault();
    activate(otp);
  };

  return (
    <div>
      <h1>Activate Your Account</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="4"
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Activating...' : 'Activate Account'}
        </button>
      </form>
    </div>
  );
};

export default ActivateRegisterPage;
