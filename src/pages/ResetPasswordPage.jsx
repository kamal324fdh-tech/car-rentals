import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const email = location.state?.email || "";
  const token = location.state?.token || ""; 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !token) {
      toast.error("Security session tracker lost. Restart recovery.", toastStyles.error);
      return;
    }

    if (!form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all parameter keys.", toastStyles.error);
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.", toastStyles.error);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Password values mismatch.", toastStyles.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: email,
          password: form.newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to finalize encryption override sequence.");
      }

      toast.success("Security keys successfully updated! Redirecting...", toastStyles.success);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">New Credentials</h1>
            <p className="text-slate-400 text-sm">
              Overwrite access keys for: <span className="text-amber-500 font-mono text-xs">{email || "unknown"}</span>
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                New Password Key
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                required
                value={form.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Confirm Password Key
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
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
              {loading ? "Overwriting Security Keys..." : "Update Credentials"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Abort recovery path?{" "}
            <Link to="/login" className="text-amber-500 font-medium hover:underline">
              Return to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}