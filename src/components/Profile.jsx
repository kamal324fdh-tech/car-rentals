import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("velocity_user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("velocity_token");
    localStorage.removeItem("velocity_user");
    localStorage.removeItem("latest_booking");

    navigate("/home");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="bg-slate-900 rounded-3xl p-10 w-full max-w-xl shadow-2xl border border-slate-800">
        
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center text-5xl font-black text-white">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="text-3xl font-bold text-white mt-6">
            {user.name}
          </h1>

          <p className="text-slate-400">
            {user.email}
          </p>
        </div>

        <div className="mt-10 space-y-5">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Phone Number</p>
            <h3 className="text-white font-semibold">
              {user.phone || "Not Provided"}
            </h3>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Member Since</p>
            <h3 className="text-white font-semibold">
              {user.joined || "Recent"}
            </h3>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Account Status</p>
            <h3 className="text-green-400 font-semibold">
              {user.status || "Active"}
            </h3>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Bookings</p>
            {/* Added fallback array to prevent .length crash */}
            {(user.bookings || []).length === 0 ? (
              <p className="text-slate-300">
                No bookings yet.
              </p>
            ) : (
              user.bookings.map((booking, index) => (
                <p key={index} className="text-white">{booking}</p>
              ))
            )}
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            to="/cars"
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-center py-3 rounded-xl font-bold text-white"
          >
            Browse Cars
          </Link>

          <button
            onClick={logout}
            className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold text-white"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}