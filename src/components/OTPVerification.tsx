import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, CheckCircle, XCircle, Clock, ExternalLink, Smartphone } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onResend: () => void;
  onCancel: () => void;
}

export function OTPVerification({ phoneNumber, onVerified, onResend, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onVerified();
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimeLeft(300);
    setCanResend(false);
    onResend();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <MessageCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Phone
          </h2>
          <p className="text-gray-600">
            We sent a 6-digit code to
          </p>
          <p className="font-semibold text-gray-900">
            {phoneNumber}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              />
            ))}
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center text-red-600 text-sm mb-4"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Code expires in {formatTime(timeLeft)}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Verify Code
              </>
            )}
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Resend Code
            </button>
            
            <button
              onClick={onCancel}
              className="flex-1 bg-red-100 text-red-700 py-3 px-6 rounded-lg hover:bg-red-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* WhatsApp Info */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-green-800 font-medium mb-1">
                Check WhatsApp
              </p>
              <p className="text-green-700">
                Your verification code was sent via WhatsApp. Make sure to check your WhatsApp messages.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
