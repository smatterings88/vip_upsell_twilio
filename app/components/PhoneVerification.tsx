import React, { useState } from 'react';
import { sendSMS, makeServerCall } from '@/lib/twilioClient';

interface PhoneVerificationProps {
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState('');

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = async () => {
    try {
      setError('');
      const code = generateVerificationCode();
      const message = `Your verification code is: ${code}`;
      
      const success = await sendSMS(phoneNumber, message);
      
      if (success) {
        setSentCode(code);
        setShowCodeInput(true);
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode === sentCode) {
      try {
        const success = await makeServerCall(phoneNumber);
        if (success) {
          onVerified();
        } else {
          setError('Failed to initiate call. Please try again.');
        }
      } catch (error) {
        setError('An error occurred while making the call.');
      }
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
          Phone No.
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
        />
      </div>

      {!showCodeInput ? (
        <button
          onClick={handleSendCode}
          disabled={!phoneNumber}
          className="w-full hover:bg-gray-700 px-6 py-2 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Call Phone
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              maxLength={6}
            />
          </div>
          <button
            onClick={handleVerifyCode}
            disabled={!verificationCode}
            className="w-full hover:bg-gray-700 px-6 py-2 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify & Call
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default PhoneVerification;