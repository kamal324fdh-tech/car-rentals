import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get selected car from router state
  const car = location.state?.car;

  // User state
  const [userProfile, setUserProfile] = useState(null);

  // Booking states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication + user loading
  useEffect(() => {
    const token = localStorage.getItem("velocity_token");
    const savedUser = localStorage.getItem("velocity_user");

    // Redirect if user is not logged in
    if (!token) {
      navigate("/");
      return;
    }

    // Redirect if no car exists
    if (!car) {
      navigate("/cars");
      return;
    }

    // Safely parse user profile
    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data");
      }
    }
  }, [car, navigate]);

  // Calculate rental days
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T00:00:00");

      const difference = end.getTime() - start.getTime();
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

      if (days > 0) {
        setTotalDays(days);
        setErrorMessage("");
      } else {
        setTotalDays(0);
        setErrorMessage("Return date must be after pick-up date.");
      }
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  // Submit booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage("Please select booking dates.");
      return;
    }

    if (totalDays <= 0) {
      setErrorMessage("Invalid booking duration.");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      carName: car.name,
      days: totalDays,
      start: startDate,
      end: endDate,
      totalCost: totalDays * Number(car.price),
    };

    // Save booking temporarily
    localStorage.setItem("latest_booking", JSON.stringify(bookingPayload));

    // Simulate database delay and navigate safely
    setTimeout(() => {
      setIsSubmitting(false);

      // Successfully pushes user state down to the success view
      navigate("/bookingsuccess", {
        state: {
          booking: bookingPayload,
        },
      });
    }, 1000);
  };

  // Prevent crashes if state context drops mid-render
  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE: INVOICE MANIFEST */}
        <div className="p-6 sm:p-8 bg-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <Link
              to="/cars"
              className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest inline-block"
            >
              ← Back to Cars
            </Link>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md inline-block">
                {car.type}
              </span>
              <h1 className="text-3xl font-black text-white">{car.name}</h1>
              <p className="text-sm text-slate-400 font-light">{car.description}</p>
            </div>

            <div className="space-y-3 text-sm border-t border-slate-900 pt-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transmission</span>
                <span className="text-slate-300 font-medium">{car.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fuel Infrastructure</span>
                <span className="text-slate-300 font-medium">{car.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Rate</span>
                <span className="text-slate-300 font-medium">${Number(car.price)} / day</span>
              </div>
            </div>
          </div>

          {/* Running Bill Calculation */}
          <div className="pt-6 border-t border-slate-900 mt-6">
            <span className="text-xs uppercase tracking-wider text-slate-500 block">
              Estimated Invoice Amount
            </span>
            <div className="text-3xl font-black text-white mt-1">
              ${totalDays * Number(car.price)}
              <span className="text-sm text-slate-500 font-normal global-counter">
                {" "}
                / {totalDays} day(s)
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: INTERACTIVE REGISTRATION VIEW */}
        <form
          onSubmit={handleConfirmBooking}
          className="p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Reservation</h2>
              <p className="text-sm text-slate-500 mt-1">
                Session verified as{" "}
                <span className="text-blue-400 font-medium">
                  {userProfile?.email || "Guest Token"}
                </span>
              </p>
            </div>

            {/* Error Notifications */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl animate-fade-in">
                {errorMessage}
              </div>
            )}

            {/* Pickup Input Configuration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pick-up Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Return Input Configuration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Return Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 font-light">
              🛡️ An auxiliary configuration check will execute verification protocols during routing processing.
            </div>
          </div>

          {/* Submission Event Interceptor */}
          <button
            type="submit"
            disabled={isSubmitting || totalDays <= 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/20 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/5 text-sm"
          >
            {isSubmitting ? "Processing Verification..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}