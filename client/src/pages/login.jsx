import axios from "axios";
import React, { useState } from "react";
import { setUserData } from "../Redux/slices/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!userEmail || !userPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);

      const user = { email: userEmail, password: userPassword };
      const result = await axios.post("http://localhost:4000/user/login", user);

      if (result.data.status === "Error" || result.data.status === "FAILED") {
        toast.error(result.data.message || "Wrong credentials");
      } else {
        if (result.data.token) {
          console.log("Token received:", result.data.token); // 👈 Add this
          localStorage.setItem("token", result.data.token);
        } else {
          console.warn("No token received from backend.");
        }
        console.log("Login response: ", result.data);


        dispatch(setUserData({ user: result.data.user, token: result.data.token }));

        localStorage.setItem('userData', JSON.stringify(result.data.user));
        toast.success("Logged in successfully!");
        navigate("/");
      }

    } catch (error) {
      console.error("❌ Cannot Login the User: ", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-6"
        onSubmit={loginUser}
      >
        <h1 className="text-3xl font-bold text-center text-blue-600">Login</h1>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="userPassword">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="userPassword"
                className="w-full rounded-md border border-gray-300 p-2 pr-16 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="*********"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline hover:font-semibold">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <button
          className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center text-sm">
          <p>New to NoteHive?</p>
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
