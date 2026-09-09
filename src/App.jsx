import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";

import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Home from "./pages/HomePage";
import Cars from "./pages/Cars";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Otp from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPasswordPage";
import AdminDashboard from "./admin/AdminDashboard";

import Profile from "./components/Profile";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingsuccess" element={<BookingSuccess />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}