import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Home from "./pages/HomePage";
import Cars from "./pages/Cars";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";

import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Navbar */}
      <Navbar />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />

      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* All Routes are now Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingsuccess" element={<BookingSuccess />} />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}