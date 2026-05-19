import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Check for your exact local storage key names on load
  useEffect(() => {
    const token = localStorage.getItem("velocity_token");
    const userString = localStorage.getItem("velocity_user");

    if (token) {
      setIsLoggedIn(true);
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString);
          setUserName(parsedUser.name || "");
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handler function for conditional routing
  const handleBrowseCarsClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("/cars");
    } else {
      navigate("/signup");
    }
  };

  // Clears the exact keys you set up in Login.jsx
  const handleLogout = () => {
    localStorage.removeItem("velocity_token");
    localStorage.removeItem("velocity_user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black tracking-tight text-white">
                Drive<span className="text-blue-500">Lux</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-10">
              <a href="#home" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">Home</a>
              <a href="#about" className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">About</a>
              <a href="#services" className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">Services</a>
              <a href="#process" className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">Features</a>
              <button onClick={handleBrowseCarsClick} className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                Browse Cars
              </button>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-6">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/10">
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-400">Hi, {userName || "Driver"}</span>
                  <Link to="/cars" className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors">
                    Go to Cars
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-white p-2 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <div className="text-2xl font-light w-6 h-6 flex items-center justify-center">✕</div>
                ) : (
                  <div className="space-y-2 w-6">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-900 px-6 pt-4 pb-8 space-y-4">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-slate-200 py-2">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400 py-2">About</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400 py-2">Services</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400 py-2">How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400 py-2">Features</a>
            
            <button 
              onClick={(e) => { setMobileMenuOpen(false); handleBrowseCarsClick(e); }} 
              className="block w-full text-left text-lg font-medium text-slate-400 py-2 cursor-pointer"
            >
              Browse Cars
            </button>

            <div className="pt-6 border-t border-slate-900 flex flex-col space-y-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="w-full text-center py-3 text-sm font-medium text-slate-300 rounded-xl border border-slate-800">
                    Login
                  </Link>
                  <Link to="/signup" className="w-full text-center py-3 text-sm font-medium bg-blue-600 text-white rounded-xl">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-sm text-slate-400 text-center">Logged in as {userName}</div>
                  <Link to="/cars" className="w-full text-center py-3 text-sm font-medium bg-blue-600 text-white rounded-xl">
                    Go to Cars
                  </Link>
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-center py-3 text-sm font-medium text-slate-400 border border-slate-800 rounded-xl cursor-pointer">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <header id="home" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-blue-400 bg-blue-500/5 border border-blue-500/10 uppercase">
            Next Generation Fleet Management
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
            Car Rental Management System
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Streamline your entire vehicle network. A high-performance SaaS platform built explicitly for luxury rental scheduling, key distribution pipelines, and real-time fleet analytics.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-5 max-w-md mx-auto">
            <Link to="/signup" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 text-base text-center">
              Get Started
            </Link>
            <button 
              onClick={handleBrowseCarsClick} 
              className="w-full bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold px-8 py-5 rounded-2xl transition-all text-base text-center cursor-pointer"
            >
              Browse Cars
            </button>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none"></div>
      </header>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-36 sm:py-48 border-t border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase">Who We Are</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Redefining premium vehicle workflows for global operations.
          </p>
          <p className="pt-4 text-lg sm:text-xl text-slate-400 leading-relaxed font-light max-w-4xl mx-auto">
            velocity-rentals bridges the functional gap between ultimate high-end mobility and enterprise level operational performance. Our complete technical infrastructure provides clients an uncompromised booking client portal, while simultaneously provisioning backend managers with robust tracking dashboards to control assignments and clear rental queues instantly.
          </p>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="py-20 border-t border-slate-900 bg-slate-900/10 space-y-32 sm:space-y-48">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-24">
            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">Capabilities</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Our Core Services</p>
          </div>

          {/* Service Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 border-b border-slate-900">
            <div className="lg:col-span-4 text-4xl sm:text-6xl font-black text-slate-800">[01]</div>
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-white mb-2">Car Booking System</h3>
              <p className="text-slate-400 text-sm">Automated scheduling engines built directly for immediate fulfillment.</p>
            </div>
            <div className="lg:col-span-4 text-slate-400 text-base leading-relaxed font-light">
              Experience seamless date reservation structures paired with flexible custom logic criteria. Users can check global vehicle availability metrics and book premium spaces within seconds.
            </div>
          </div>

          {/* Service Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 border-b border-slate-900">
            <div className="lg:col-span-4 text-4xl sm:text-6xl font-black text-slate-800">[02]</div>
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h3>
              <p className="text-slate-400 text-sm">Full operational analytics across entire business units.</p>
            </div>
            <div className="lg:col-span-4 text-slate-400 text-base leading-relaxed font-light">
              Control fleets from a unified dashboard node. Monitor operational status parameters, filter ongoing user logs, approve rental extensions, and optimize layout yields in real-time.
            </div>
          </div>

          {/* Service Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 border-b border-slate-900">
            <div className="lg:col-span-4 text-4xl sm:text-6xl font-black text-slate-800">[03]</div>
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-white mb-2">Secure Management</h3>
              <p className="text-slate-400 text-sm">Protected asset distribution frameworks.</p>
            </div>
            <div className="lg:col-span-4 text-slate-400 text-base leading-relaxed font-light">
              Your profile security represents our primary system requirement. Encrypted identity checks protect sensitive client files, access tracking permissions, and checkout gateways seamlessly.
            </div>
          </div>

          {/* Service Block 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
            <div className="lg:col-span-4 text-4xl sm:text-6xl font-black text-slate-800">[04]</div>
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-white mb-2">Easy User Experience</h3>
              <p className="text-slate-400 text-sm">Clean architectural flows across all interaction points.</p>
            </div>
            <div className="lg:col-span-4 text-slate-400 text-base leading-relaxed font-light">
              We remove unnecessary complexity. From simple onboarding flows to getting physical vehicle configurations approved, every single system layout remains responsive, simple, and clean.
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="process" className="py-36 sm:py-48 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">The Process</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">How It Works</p>
          </div>

          <div className="space-y-24 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="relative pl-8 sm:pl-32 border-l-2 border-slate-900 pb-12">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-blue-600 rounded-full ring-4 ring-slate-950"></div>
              <div className="sm:absolute sm:left-0 text-xl font-bold text-blue-500 mb-2 sm:mb-0">STEP 01</div>
              <h3 className="text-2xl font-bold text-white mb-3">Create Account</h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Set up your profile within our cloud container system. Verify credentials instantly to configure authorization access as a standard tenant or system platform administrator.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 sm:pl-32 border-l-2 border-slate-900 pb-12">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-slate-800 rounded-full ring-4 ring-slate-950"></div>
              <div className="sm:absolute sm:left-0 text-xl font-bold text-slate-600 mb-2 sm:mb-0">STEP 02</div>
              <h3 className="text-2xl font-bold text-white mb-3">Browse Available Cars</h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Filter through catalog layouts containing high-performance vehicle inventory. Inspect granular specific attributes, engine parameters, metrics, and regional real-time status slots.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 sm:pl-32 border-l-2 border-slate-900 pb-12">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-slate-800 rounded-full ring-4 ring-slate-950"></div>
              <div className="sm:absolute sm:left-0 text-xl font-bold text-slate-600 mb-2 sm:mb-0">STEP 03</div>
              <h3 className="text-2xl font-bold text-white mb-3">Book Car Instance</h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Select your required operational timeline metrics, set droppoints, and send tracking request configurations into our automated data pipeline with complete pricing breakdowns transparently.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8 sm:pl-32">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-slate-800 rounded-full ring-4 ring-slate-950"></div>
              <div className="sm:absolute sm:left-0 text-xl font-bold text-slate-600 mb-2 sm:mb-0">STEP 04</div>
              <h3 className="text-2xl font-bold text-white mb-3">Admin Panel Approval</h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Platform operators analyze parameters for logistics conflicts, authorize scheduling locks, and dispatch direct confirmation access links directly to your digital dashboard window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES SECTION */}
      <section id="features" className="py-36 sm:py-48 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">Architecture</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">System Features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-slate-950 border border-slate-900 rounded-3xl space-y-4 hover:border-slate-800 transition-all">
              <span className="text-xs font-bold text-blue-500 bg-blue-500/5 px-3 py-1 rounded-md tracking-wider uppercase">Optimization</span>
              <h4 className="text-2xl font-bold text-white">Fast Booking Pipelines</h4>
              <p className="text-slate-400 text-base font-light leading-relaxed">
                Eliminate processing overhead with instant request routing. Our optimized calendar validation layers ensure no double-booking errors can occur across global distributed operations.
              </p>
            </div>

            <div className="p-10 bg-slate-950 border border-slate-900 rounded-3xl space-y-4 hover:border-slate-800 transition-all">
              <span className="text-xs font-bold text-blue-500 bg-blue-500/5 px-3 py-1 rounded-md tracking-wider uppercase">Protection</span>
              <h4 className="text-2xl font-bold text-white">Secure Access Infrastructure</h4>
              <p className="text-slate-400 text-base font-light leading-relaxed">
                Enterprise data handling schemas shield administrative tracking parameters. Built using security-first structural code to safely isolate identity checks and contract workflows.
              </p>
            </div>

            <div className="p-10 bg-slate-950 border border-slate-900 rounded-3xl space-y-4 hover:border-slate-800 transition-all">
              <span className="text-xs font-bold text-blue-500 bg-blue-500/5 px-3 py-1 rounded-md tracking-wider uppercase">Interface</span>
              <h4 className="text-2xl font-bold text-white">Minimalist Management UI</h4>
              <p className="text-slate-400 text-base font-light leading-relaxed">
                A clean operational space optimized to decrease user friction. Avoid dense layers of multi-nested submenus; control parameters clearly from high-visibility viewport grids.
              </p>
            </div>

            <div className="p-10 bg-slate-950 border border-slate-900 rounded-3xl space-y-4 hover:border-slate-800 transition-all">
              <span className="text-xs font-bold text-blue-500 bg-blue-500/5 px-3 py-1 rounded-md tracking-wider uppercase">Fulfillment</span>
              <h4 className="text-2xl font-bold text-white">24/7 Global Connectivity</h4>
              <p className="text-slate-400 text-base font-light leading-relaxed">
                System support components run constantly behind the scenes to track logs, resolve unexpected system validation drops, and secure ongoing client reservation deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="py-40 sm:py-56 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Start Your Journey Today
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Gain immediate control over premium vehicle availability pools, organize reservation clusters, or select your absolute driving option now.
          </p>
          <div className="pt-4 flex justify-center">
            <button 
              onClick={handleBrowseCarsClick} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 text-base cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} velocity-rentals Systems. Premium fleet ecosystem architecture. All rights reserved.
          </p>
          <div className="flex space-x-8 text-sm text-slate-600">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}