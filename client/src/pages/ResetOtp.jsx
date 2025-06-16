// 📂 src/pages/ResetOtp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      alert('Please enter email and OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/user/verify-reset-otp', { email, otp });
      if (response.data.status === 'SUCCESS') {
        alert('OTP verified. You can reset your password');
        localStorage.setItem('resetEmail', email); // Save email
        navigate('/reset-password');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetOtp;
