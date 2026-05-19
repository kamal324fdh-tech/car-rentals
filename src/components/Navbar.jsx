import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Monitors page routing changes

  // Automatically checks auth status whenever the user navigates to a new page
  useEffect(() => {
    const token = localStorage.getItem("velocity_token");
    const userString = localStorage.getItem("velocity_user");

    if (token) {
      setIsLoggedIn(true);
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString);
          setUserName(parsedUser.name || "Driver");
        } catch (e) {
          console.error("Error parsing user data in Navbar:", e);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [location]); // Triggers on every route shift so the state stays perfectly synchronized

  const handleLogout = () => {
    localStorage.removeItem("velocity_token");
    localStorage.removeItem("velocity_user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-90">
        velocity-rentals
      </Link>

      <div className="flex items-center gap-5 text-white">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="hover:text-blue-400 transition duration-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-500 transition duration-300"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-6">
            {/* Replaces sign in/up with user profile status */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold uppercase text-amber-500">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline">Profile ({userName})</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-400 hover:text-red-400 transition duration-300 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}