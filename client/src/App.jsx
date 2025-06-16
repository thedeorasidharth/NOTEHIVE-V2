// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';

import Signup from "./pages/signup";
import Header from "./components/Header";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetOtp from './pages/ResetOtp';
import ResetPassword from './pages/ResetPassword';
import Faq from "./pages/Faq";
import About from "./pages/About";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {

  // Set JWT token in axios headers globally (runs once)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<ResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />

        {/* Protected Routes */}
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
