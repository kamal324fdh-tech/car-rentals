// components/GoogleButton.jsx

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

export default function GoogleButton({ text }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Google Auth");
    }, 2000);
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-xl"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={22} />
      ) : (
        <>
          <FcGoogle size={24} />
          {text}
        </>
      )}
    </button>
  );
}