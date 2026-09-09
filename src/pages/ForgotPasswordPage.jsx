import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

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

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your account email address.", toastStyles.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          type: "forgot" 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to issue verification code.");
      }

      toast.success("Security token sent to your email inbox! 📬", toastStyles.success);
      
      const targetEmail = email.trim().toLowerCase();
      
      setTimeout(() => {
        navigate("/verify-otp", { 
          state: { 
            email: targetEmail, 
            type: "forgot" 
          } 
        }); 
      }, 1000);

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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Recover Key</h1>
            <p className="text-slate-400 text-sm">Request a verification token to overwrite access parameters</p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Account Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@velocityrentals.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150"
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3.5 px-4 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
            >
              {loading ? "Generating Token..." : "Send Verification Code"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Remembered your access key?{" "}
            <Link to="/login" className="text-amber-500 font-medium hover:underline">
              Return to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}