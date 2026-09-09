import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const car = location.state?.car;

  const [userProfile, setUserProfile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("velocity_token");
    const savedUser = localStorage.getItem("velocity_user");

    if (!car) {
      console.warn("No vehicle metadata context found. Redirecting to fleet view.");
      navigate("/cars");
      return;
    }

    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to extract active user payload data:", error);
      }
    }
  }, [car, navigate]);

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
        setErrorMessage("Return date must be scheduled after the pick-up date.");
      }
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  // Connect directly with the backend server routing matrix
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage("Please select valid booking dates.");
      return;
    }

    if (totalDays <= 0) {
      setErrorMessage("Invalid booking timeline configuration.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // 1. Grab the live JWT signature from security storage
    const token = localStorage.getItem("velocity_token");
    if (!token) {
      setErrorMessage("Authentication session missing. Please log in to secure this ride.");
      setIsSubmitting(false);
      return;
    }

    // 2. Map payloads directly to your mongoose model expectation variables
    const totalCost = totalDays * Number(car.price);
    
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Middleware decodes this to identify user profile email
        },
        body: JSON.stringify({
          carId: car._id || car.id, // Handles standard mongo objects and custom IDs safely
          startDate,
          endDate,
          totalPrice: totalCost
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save the snapshot record locally if your success page needs to read it
        const bookingPayload = {
          carName: car.name,
          days: totalDays,
          start: startDate,
          end: endDate,
          totalCost: totalCost,
        };
        localStorage.setItem("latest_booking", JSON.stringify(bookingPayload));

        // 3. Clear submitting state and pass control over to your confirmation screen
        setIsSubmitting(false);
        navigate("/bookingsuccess", {
          state: {
            booking: bookingPayload,
          },
        });
      } else {
        setErrorMessage(data.message || "Engine pipeline rejected booking compilation.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Booking API pipeline crash:", error);
      setErrorMessage("Failed to communicate with live fleet infrastructure database.");
      setIsSubmitting(false);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-sans">
        <div className="animate-pulse tracking-wide text-xs uppercase font-semibold">Initializing Reservation Channel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-12 flex items-center justify-center font-sans selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-6 sm:p-8 bg-slate-950/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900">
          <div className="space-y-6">
            <Link
              to="/cars"
              className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest inline-flex items-center gap-1 transition"
            >
              ← Back to Showroom Fleet
            </Link>

            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-md inline-block">
                {car.type} Classification
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">{car.name}</h1>
              <p className="text-sm text-slate-400 font-light leading-relaxed">{car.description}</p>
            </div>

            <div className="space-y-3 text-sm border-t border-slate-900 pt-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transmission Configuration</span>
                <span className="text-slate-300 font-medium">{car.transmission}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Powertrain Infrastructure</span>
                <span className="text-slate-300 font-medium">{car.fuel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Base Unit Rate</span>
                <span className="text-slate-300 font-medium">${Number(car.price)} / day</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 mt-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
              Estimated Gross Statement
            </span>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">
              ${totalDays * Number(car.price)}
              <span className="text-xs text-slate-500 font-normal tracking-normal ml-1">
                for {totalDays} transaction day(s)
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleConfirmBooking}
          className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900/10"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Reservation</h2>
              <p className="text-sm text-slate-500 mt-1">
                Active Client Session:{" "}
                <span className="text-blue-400 font-medium">
                  {userProfile?.email || "Demo Presenter Profile"}
                </span>
              </p>
            </div>

            {errorMessage && (
              <div className="bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs px-4 py-3 rounded-xl font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Pick-up Delivery Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white focus:outline-none focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500 shadow-inner text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Return Return Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white focus:outline-none focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500 shadow-inner text-sm"
              />
            </div>

            <div className="bg-slate-950 border border-slate-950 rounded-xl p-4 text-xs text-slate-500 font-light leading-relaxed">
              🛡️ Automated rental calculation parameters will instantly build and dispatch tracking logs to MongoDB clusters.
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || totalDays <= 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:border disabled:border-slate-850 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-600/5"
          >
            {isSubmitting ? "Processing Fleet Handshake..." : "Complete Reservation System"}
          </button>
        </form>
      </div>
    </div>
  );
}