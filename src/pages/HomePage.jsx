import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Banknote, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("velocity_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  return (
    <main className="bg-slate-950 text-white min-h-screen">

      <nav className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-900 px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/home" className="text-2xl font-black text-cyan-400 tracking-wider">
          VELOCITY<span className="text-white">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/home" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition hidden sm:inline">
            Home
          </Link>
          <Link to="/cars" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition hidden sm:inline">
            Cars
          </Link>

          {currentUser ? (
            <Link 
              to="/profile" 
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-4 py-2 rounded-xl transition group text-white"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-black text-white uppercase shadow-md shadow-cyan-500/10">
                {currentUser.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-semibold tracking-wide group-hover:text-cyan-400 transition">
                {currentUser.name}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-semibold transition">
                Log in
              </Link>
              <Link to="/signup" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/10">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <section className="min-h-[calc(screen-64px)] flex items-center py-16">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
              Premium Car Rental
            </span>

            <h1 className="mt-8 text-6xl font-black leading-tight">
              Drive Your
              <span className="text-cyan-400"> Dream Car </span>
              Today.
            </h1>

            <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">
              Experience comfort, luxury and affordability with Velocity.
              Choose from our premium fleet and book your ride in minutes.
            </p>

            <div className="mt-10 flex gap-5">
              <Link
                to="/cars"
                className="bg-cyan-500 hover:bg-cyan-400 px-8 py-4 rounded-xl font-semibold transition"
              >
                Browse Cars
              </Link>

              <a
                href="#featured"
                className="border border-slate-700 hover:border-cyan-400 px-8 py-4 rounded-xl transition"
              >
                Explore
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">

              <div>
                <h2 className="text-3xl font-black text-cyan-400">500+</h2>
                <p className="text-slate-400">Happy Clients</p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-cyan-400">120+</h2>
                <p className="text-slate-400">Luxury Cars</p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-cyan-400">24/7</h2>
                <p className="text-slate-400">Support</p>
              </div>

            </div>
          </div>

          <div className="relative">

            <div className="absolute w-96 h-96 bg-cyan-500 blur-[140px] opacity-30 rounded-full"></div>

            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Car"
              className="relative rounded-3xl shadow-2xl"
            />

          </div>

        </div>
      </section>

      <section
        id="featured"
        className="py-24 max-w-7xl mx-auto px-8"
      >

        <h2 className="text-5xl font-black text-center">
          Featured Cars
        </h2>

        <p className="text-center text-slate-400 mt-5">
          Discover our most rented premium vehicles.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-16">

          <div className="bg-slate-900 rounded-3xl overflow-hidden hover:-translate-y-2 transition">

            <img
              src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <h3 className="text-2xl font-bold">
                Mercedes C-Class
              </h3>

              <p className="text-slate-400 mt-2">
                Luxury Sedan
              </p>

              <div className="flex justify-between mt-8">

                <span className="text-cyan-400 text-2xl font-bold">
                  $120/day
                </span>

                <Link
                  to="/cars"
                  className="bg-cyan-500 px-5 py-2 rounded-lg"
                >
                  Rent
                </Link>

              </div>

            </div>

          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden hover:-translate-y-2 transition">

            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <h3 className="text-2xl font-bold">
                BMW X5
              </h3>

              <p className="text-slate-400 mt-2">
                Premium SUV
              </p>

              <div className="flex justify-between mt-8">

                <span className="text-cyan-400 text-2xl font-bold">
                  $180/day
                </span>

                <Link
                  to="/cars"
                  className="bg-cyan-500 px-5 py-2 rounded-lg"
                >
                  Rent
                </Link>

              </div>

            </div>

          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden hover:-translate-y-2 transition">

            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="h-60 w-full object-cover"
            />

            <div className="p-8">

              <h3 className="text-2xl font-bold">
                Toyota Camry
              </h3>

              <p className="text-slate-400 mt-2">
                Comfort Sedan
              </p>

              <div className="flex justify-between mt-8">

                <span className="text-cyan-400 text-2xl font-bold">
                  $80/day
                </span>

                <Link
                  to="/cars"
                  className="bg-cyan-500 px-5 py-2 rounded-lg"
                >
                  Rent
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-24 bg-slate-900">

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-5xl font-black text-center">
            Why Choose Velocity?
          </h2>

          <p className="text-center text-slate-400 mt-5">
            We make renting a car simple, affordable and enjoyable.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-20">

            {/* Premium Fleet */}
            <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center text-center border border-slate-800 hover:border-cyan-500 transition group">
              <div className="p-4 bg-slate-900 rounded-xl mb-5 group-hover:bg-cyan-500/10 transition">
                <Car className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold">Premium Fleet</h3>
              <p className="mt-4 text-slate-400">
                Choose from luxury sedans, SUVs and sports cars.
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center text-center border border-slate-800 hover:border-cyan-500 transition group">
              <div className="p-4 bg-slate-900 rounded-xl mb-5 group-hover:bg-cyan-500/10 transition">
                <Banknote className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold">Affordable Pricing</h3>
              <p className="mt-4 text-slate-400">
                Transparent pricing with no hidden charges.
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center text-center border border-slate-800 hover:border-cyan-500 transition group">
              <div className="p-4 bg-slate-900 rounded-xl mb-5 group-hover:bg-cyan-500/10 transition">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold">Fast Booking</h3>
              <p className="mt-4 text-slate-400">
                Reserve your vehicle in less than two minutes.
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center text-center border border-slate-800 hover:border-cyan-500 transition group">
              <div className="p-4 bg-slate-900 rounded-xl mb-5 group-hover:bg-cyan-500/10 transition">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="mt-4 text-slate-400">
                Our team is always available whenever you need help.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-5xl font-black text-center">
            How It Works
          </h2>

          <p className="text-center text-slate-400 mt-5">
            Renting your dream car has never been easier.
          </p>

          <div className="grid md:grid-cols-4 gap-10 mt-20">

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-black">
                1
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Choose a Car
              </h3>

              <p className="mt-3 text-slate-400">
                Browse our premium collection and select your favorite.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-black">
                2
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Book Online
              </h3>

              <p className="mt-3 text-slate-400">
                Fill in your rental details and confirm instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-black">
                3
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Pick Up
              </h3>

              <p className="mt-3 text-slate-400">
                Visit our location and collect your reserved vehicle.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-black">
                4
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Enjoy Your Ride
              </h3>

              <p className="mt-3 text-slate-400">
                Drive with confidence and enjoy every journey.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="py-24 bg-slate-900">

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-5xl font-black text-center">
            What Our Customers Say
          </h2>

          <p className="text-center text-slate-400 mt-5">
            Trusted by hundreds of happy drivers.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-20">

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800">
              <div className="text-yellow-400 text-2xl">★★★★★</div>

              <p className="mt-6 text-slate-300">
                "The booking process was smooth and the vehicle was spotless.
                Highly recommended!"
              </p>

              <h4 className="mt-8 font-bold text-cyan-400">
                — John D.
              </h4>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800">
              <div className="text-yellow-400 text-2xl">★★★★★</div>

              <p className="mt-6 text-slate-300">
                "Affordable prices and excellent customer support.
                I'll definitely rent again."
              </p>

              <h4 className="mt-8 font-bold text-cyan-400">
                — Sarah M.
              </h4>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800">
              <div className="text-yellow-400 text-2xl">★★★★★</div>

              <p className="mt-6 text-slate-300">
                "The BMW I rented was in perfect condition.
                Velocity exceeded my expectations."
              </p>

              <h4 className="mt-8 font-bold text-cyan-400">
                — David A.
              </h4>
            </div>

          </div>

        </div>

      </section>

      <section className="py-24">

        <div className="max-w-5xl mx-auto px-8">

          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-16 text-center">

            <h2 className="text-5xl font-black">
              Ready To Hit The Road?
            </h2>

            <p className="mt-6 text-lg">
              Book your dream car today and experience premium driving with Velocity.
            </p>

            <Link
              to="/cars"
              className="inline-block mt-10 bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:scale-105 transition"
            >
              Browse Cars
            </Link>

          </div>

        </div>

      </section>

      <footer className="border-t border-slate-800 py-12">

        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h2 className="text-3xl font-black">
              Velocity<span className="text-cyan-400">.</span>
            </h2>

            <p className="text-slate-500 mt-3">
              Premium Car Rental Experience.
            </p>
          </div>

          <div className="flex gap-8 text-slate-400">

            <Link to="/home" className="hover:text-white">
              Home
            </Link>

            <Link to="/cars" className="hover:text-white">
              Cars
            </Link>

            <Link to="/login" className="hover:text-white">
              Login
            </Link>

            <Link to="/signup" className="hover:text-white">
              Sign Up
            </Link>

          </div>

        </div>

        <p className="text-center text-slate-600 mt-10">
          © 2026 Velocity Car Rental. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}