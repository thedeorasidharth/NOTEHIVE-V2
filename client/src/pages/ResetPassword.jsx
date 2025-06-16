// 📂 src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      alert('Please verify OTP first');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/user/reset-password', {
        email,
        newPassword,
      });

      if (res.data.status === 'SUCCESS') {
        alert('Password reset successful');
        localStorage.removeItem('resetEmail');
        navigate('/login');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
