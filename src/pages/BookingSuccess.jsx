import { useLocation, Link } from "react-router-dom";

export default function BookingSuccess() {
  const location = useLocation();
  
  // FIX: If no state is passed, use default mock data so the page doesn't crash or redirect
  const bookingDetails = location.state?.booking || {
    carName: "Premium Fleet Vehicle",
    days: 3,
    start: "Pending Confirmation",
    end: "Pending Confirmation",
    totalCost: 250
  };

  // Static Bank Details for Payment
  const BANK_DETAILS = {
    accountName: "Velocity Fleet Rentals Ltd",
    accountNumber: "1023948571",
    bankName: "Apex National Bank",
    referenceCode: "VEL-839201"
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Success Indicator */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Reservation Hold Placed</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto font-light">
            Your vehicle is temporarily locked into the schedule. Please complete the wire transfer payment below to finalize your booking.
          </p>
        </div>

        <hr className="border-slate-850" />

        {/* Bank Payment Instructions */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">Bank Transfer Payment Instructions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Account Name</span>
              <span className="text-white font-bold block">{BANK_DETAILS.accountName}</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Account Number</span>
              <span className="text-white font-mono font-black text-lg tracking-wider block">
                {BANK_DETAILS.accountNumber}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Bank Name</span>
              <span className="text-slate-300 font-semibold block">{BANK_DETAILS.bankName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Payment Reference</span>
              <span className="text-blue-400 font-mono font-bold block">{BANK_DETAILS.referenceCode}</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl text-xs text-slate-400">
            ⚠️ <span className="text-slate-300 font-medium">Important:</span> Include the payment reference code in your bank transfer memo to ensure automatic payment validation.
          </div>
        </div>

        {/* Summary Breakdown */}
        <div className="border border-slate-850/60 rounded-2xl p-5 space-y-3 text-sm bg-slate-900/40">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Order Manifest</h3>
          <div className="flex justify-between"><span className="text-slate-400">Selected Vehicle:</span> <span className="text-white font-medium">{bookingDetails.carName}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Duration:</span> <span className="text-slate-300">{bookingDetails.days} Days</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Timeline:</span> <span className="text-slate-300">{bookingDetails.start} to {bookingDetails.end}</span></div>
          <hr className="border-slate-850 my-1" />
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-slate-400 font-semibold">Total Invoice Amount:</span> 
            <span className="text-2xl font-black text-white">${bookingDetails.totalCost}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 text-center">
          <Link 
            to="/cars" 
            className="inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all text-center shadow-lg shadow-blue-600/10"
          >
            Return to Fleet Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}