import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; 

export default function Signup() {
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("All fields are required", toastStyles.error);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match", toastStyles.error);
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters", toastStyles.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unexpected registration issue occurred.");
      }

      // FIXED: Storing both token and user profile data to match Home.jsx requirements
      if (data.token) {
        localStorage.setItem("velocity_token", data.token);
        localStorage.setItem("velocity_user", JSON.stringify(data.user));
      }

      toast.success("Account created successfully 🚗", toastStyles.success);
      
      // Reroutes straight to the /cars platform
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
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-black tracking-wider text-amber-500">VELOCITY</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">RENTALS</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Unlock premium keys to your next journey.
          </h2>
          <p className="text-slate-300 text-lg">
            Join today to access exclusive rates, seamless keyless entry, and our premium fleet of luxury and electric vehicles.
          </p>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <span className="text-xl font-black tracking-wider text-amber-500">VELOCITY</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Get behind the wheel
            </h1>
            <p className="text-slate-400 text-sm">
              Already have an account? <Link to="/login" className="text-amber-500 hover:underline font-medium">Log in</Link>
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
              />
            </div>

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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to Velocity's <a href="#terms" className="underline hover:text-slate-300">Terms of Service</a> and <a href="#privacy" className="underline hover:text-slate-300">Privacy Policy</a>.
            </p>

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
                  Preparing your fleet...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}