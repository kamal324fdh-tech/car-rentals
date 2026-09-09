import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Please fill in all security parameter keys.", toastStyles.error);
      return;
    }

    setLoading(true);

    try {
      // Updated from http://localhost:5000/api/auth/login to relative path
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials configuration.");
      }

      toast.success("Identity verified! Welcome back to Velocity. ✨", toastStyles.success);
      
      // Save data according to profile expectations
      localStorage.setItem("velocity_token", data.token);

      const unifiedUserObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.profile?.phone || "Not Provided",
        joined: "Verified Customer",
        status: "Active",
        bookings: [] 
      };

      localStorage.setItem("velocity_user", JSON.stringify(unifiedUserObj));

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 1500);

    } catch (error) {
      toast.error(error.message, toastStyles.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      <div className="w-full flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="text-2xl font-black tracking-wider text-amber-500">VELOCITY</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Access Portal</h1>
            <p className="text-slate-400 text-sm">Initialize deployment matrix credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="developer@velocityrentals.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password Key
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-amber-500 hover:underline relative z-10"
                >
                  Forgot Key?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150"
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3.5 px-4 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
            >
              {loading ? "Authenticating Session..." : "Authorize Login"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            New node operator?{" "}
            <Link to="/signup" className="text-amber-500 font-medium hover:underline">
              Create Environment Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}