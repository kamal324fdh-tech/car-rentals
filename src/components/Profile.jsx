import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("velocity_token");
    const userString = localStorage.getItem("velocity_user");

    // Protect the route: If no token exists, bounce them to login
    if (!token || !userString) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userString));
    } catch (e) {
      console.error("Error loading profile data:", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("velocity_token");
    localStorage.removeItem("velocity_user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading secure matrix profile...
      </div>
    );
  }

  // Get initial for the profile emblem
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "D";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 pt-28">
      {/* Glow Effect Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Profile Container Card */}
      <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        
        {/* Header/Emblem Section */}
        <div className="flex flex-col items-center text-center space-y-4 pb-8 border-b border-slate-900">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-amber-500 p-[2px] shadow-xl shadow-blue-600/10">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-black text-white tracking-wider">
              {initial}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">{user.name}</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mt-1">Velocity Elite Tier Member</p>
          </div>
        </div>

        {/* Details Grid Section */}
        <div className="py-8 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Account Credentials</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Unique Account ID</span>
              <span className="text-sm font-mono text-slate-300 break-all">{user.id || "N/A"}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Registered Email</span>
              <span className="text-sm font-medium text-slate-200">{user.email}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Security Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                JWT Verified Node
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Access Tier</span>
              <span className="inline-flex items-center text-xs font-semibold text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded-md border border-amber-500/10 mt-1">
                Standard Driver
              </span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate("/cars")}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition duration-200 text-center text-sm shadow-lg shadow-blue-600/10"
          >
            Access Vehicle Pools
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-slate-950 hover:bg-red-950/20 border border-slate-900 hover:border-red-900/40 text-slate-400 hover:text-red-400 font-medium py-4 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
          >
            Log Out Account
          </button>
        </div>

      </div>
    </div>
  );
}