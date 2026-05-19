import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const toastStyles = {
    success: {
      className: "bg-slate-950 border border-slate-800 border-l-4 border-l-amber-500 rounded-xl text-slate-100",
      bodyClassName: "text-sm font-sans text-slate-200 font-medium",
    },
    error: {
      className: "bg-slate-950 border border-slate-800 border-l-4 border-l-rose-500 rounded-xl text-slate-100",
      bodyClassName: "text-sm font-sans text-slate-200 font-medium",
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password", toastStyles.error);
      return;
    }

    setLoading(true);

  // =========================================================================
  // SECURE AUTHENTICATION FLOW
  // =========================================================================
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Store unique profile data & access token locally
      if (data.token) {
        localStorage.setItem("velocity_token", data.token);
        
        // This object contains the user's unique MongoDB id, name, and email
        localStorage.setItem("velocity_user", JSON.stringify(data.user));
      }

      toast.success(`Welcome back, ${data.user.name}! 🔑`, toastStyles.success);

      // FIXED: Safely reroutes straight to the /cars landing portal
      setTimeout(() => {
        navigate("/cars");
      }, 1500);

    } catch (error) {
      toast.error(error.message, toastStyles.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      
      {/* Left Column: Premium Branding / Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-end p-12" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-black tracking-wider text-amber-500">VELOCITY</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">RENTALS</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Welcome Back to the Fleet.
          </h2>
          <p className="text-slate-300 text-lg">
            Log in to manage your active reservations, request luxury keyless drop-offs, and access elite tier supercar pricing.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <span className="text-xl font-black tracking-wider text-amber-500">VELOCITY</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Access your keys
            </h1>
            <p className="text-slate-400 text-sm">
              New to Velocity? <Link to="/signup" className="text-amber-500 hover:underline font-medium">Create an account</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <a href="#forgot" className="text-xs text-amber-500 hover:underline font-medium">Forgot password?</a>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
              />
            </div>

            <button
              disabled={loading}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3.5 px-4 rounded-lg transition duration-200 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying credentials...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}