import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Otp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  useEffect(() => {
    if (!state?.email) {
      navigate("/signup");
      return;
    }

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const resendOtp = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: state.email,
            type: state.type,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("OTP sent again.");

      setTimer(60);
      setOtp(["", "", "", "", "", ""]);

      inputs.current[0].focus();
    } catch {
      toast.error("Couldn't resend OTP.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        state.type === "signup"
          ? "/api/auth/signup"
          : "/api/auth/verify-otp";

      const res = await fetch(
        `http://localhost:5000${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: state.name,
            email: state.email,
            password: state.password,
            otp: code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      toast.success("OTP Verified!");
      
      if (state.type === "signup") {
        localStorage.setItem(
          "velocity_user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "velocity_token",
          data.token
        );

        setTimeout(() => {
          navigate("/home"); 
        }, 1200);

      } else {
        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              email: state.email,
              token: code,
            },
          });
        }, 1200);
      }

    } catch (err) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-white">
          Verify OTP
        </h1>

        <p className="text-center text-slate-400 mt-3">
          Enter the 6-digit code sent to
        </p>

        <p className="text-center text-cyan-400 mb-8">
          {state?.email}
        </p>

        <form onSubmit={verifyOtp}>

          <div className="flex justify-between mb-8">

            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleBackspace(e, index)
                }
                className="w-12 h-14 rounded-xl bg-slate-800 border border-slate-700 text-center text-2xl font-bold text-white focus:border-cyan-500 focus:outline-none"
              />
            ))}

          </div>

          <button
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="text-center mt-8">

          {timer > 0 ? (
            <p className="text-slate-400">
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="text-cyan-400 hover:underline"
            >
              Resend OTP
            </button>
          )}

        </div>

      </div>

    </div>
  );
}