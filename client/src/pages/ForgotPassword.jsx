import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      
      // Correct endpoint with proper base URL and path
      const res = await axios.post(
        "http://localhost:4000/user/forgot-password", 
        { email },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.status === "PENDING") {
        toast.success("OTP sent to your email!");
        // Store email in localStorage for the next steps
        localStorage.setItem("resetEmail", email);
        navigate("/verify-reset-otp");
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      
      if (error.response) {
        // Backend returned an error response
        if (error.response.status === 404) {
          toast.error("No account found with this email");
        } else {
          toast.error(error.response.data.message || "Server error occurred");
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-6"
        onSubmit={handleSendOTP}
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your registered email. We'll send an OTP to reset your password.
        </p>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <button
          className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </span>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ForgotPassword;