import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !email) {
      setMessage("All fields are required");
      setStatus("error");
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/user/verify-otp', { email, otp });
      setMessage(res.data.message);
      if (res.data.status === "SUCCESS") {
        setStatus("success");
        // Redirect to home after 1s delay
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setMessage("Server error");
      setStatus("error");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter the 6-digit OTP"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Verify
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              status === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
