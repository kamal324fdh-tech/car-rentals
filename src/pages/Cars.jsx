import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Cars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("car_favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    //Grab user authentication state
    const activeToken = localStorage.getItem("velocity_token");
    const activeUser = localStorage.getItem("velocity_user");
    if (activeToken && activeUser) {
      setUserProfile(JSON.parse(activeUser));
    }

    //Fetch data from API
    const fetchCarFleet = async () => {
      try {
        setLoading(true);
       const response = await fetch("http://localhost:5000/api/cars");
        
        if (!response.ok) {
          throw new Error("Failed to communicate with live fleet database.");
        }
        
        const data = await response.json();
        setCars(data); 
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarFleet();
  }, []);

 useEffect(() => {
  const activeToken = localStorage.getItem("velocity_token");
  const activeUser = localStorage.getItem("velocity_user");

  if (activeToken && activeUser) {
    setUserProfile(JSON.parse(activeUser));
  }

  const fetchCarFleet = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/cars"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();

      setCars(data);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCarFleet();
}, []);
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "All" || car.type === selectedType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === "low-high") return a.price - b.price;
      if (sortBy === "high-low") return b.price - a.price;
      return 0;
    });
  }, [cars, search, selectedType, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-6">
        <div className="space-y-4 max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="text-rose-500 text-3xl font-bold"> Connection Error</div>
          <p className="text-slate-400 text-sm font-light leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white scroll-smooth relative overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="relative py-24 sm:py-32 border-b border-slate-900 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
            {userProfile ? `Welcome, ${userProfile.name} • Active Profile` : "Curated Fleet"}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Available Cars
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Choose from our wide range of premium and economy vehicles, pulled live from our dealership catalog.
          </p>

          <div className="pt-6 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by make or model (e.g., Porsche)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
            />
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {["All", "Luxury", "Electric", "SUV", "Economy"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
                  selectedType === type
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/10"
                    : "bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="default">Featured Fleet</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* VEHICLES RENDERING MAIN VIEW GRID */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="h-44 bg-slate-800 rounded-2xl w-full mb-4"></div>
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="group relative bg-slate-900/30 border border-slate-850 hover:border-slate-700/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/50"
              >
                <div>
                  {/* API CAR PICTURE WRAPPER */}
                  {car.imageUrl && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-slate-950 relative border border-slate-900">
                      <img 
                        src={car.imageUrl} 
                        alt={car.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                      {car.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(car.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 transition-colors focus:outline-none"
                    >
                      <svg
                        className={`w-4 h-4 ${favorites.includes(car.id) ? "fill-rose-500 stroke-rose-500" : "stroke-current fill-none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-md">
                      {car.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">• {car.transmission}</span>
                    <span className="text-[10px] font-medium text-slate-500">• {car.fuel}</span>
                  </div>

                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                    {car.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-900">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Daily Rate</span>
                    <div className="text-white font-black text-2xl">
                      ${car.price}<span className="text-xs text-slate-500 font-normal"> / day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setSelectedCar(car)}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate("/booking", { state: { car } })}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/10"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-white">No vehicles found</h2>
          </div>
        )}
      </main>

      {/* DETAIL DRAWER SLIDE PANEL OVERVIEW */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedCar(null)} />
          <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800/80 p-8 overflow-y-auto shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{selectedCar.type} Class</span>
                  <h2 className="text-2xl font-black text-white mt-1 tracking-tight">{selectedCar.name}</h2>
                </div>
                <button onClick={() => setSelectedCar(null)} className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white">✕</button>
              </div>

              {selectedCar.imageUrl && (
                <div className="w-full h-56 rounded-2xl overflow-hidden mt-6 border border-slate-850 bg-slate-950">
                  <img src={selectedCar.imageUrl} alt={selectedCar.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Vehicle Profile Overview</h4>
                <p className="text-sm text-slate-300 font-light leading-relaxed">{selectedCar.description}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-12 flex items-center justify-between gap-4 bg-slate-900">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Calculated Base Rate</span>
                <span className="text-2xl font-black text-white">${selectedCar.price}<span className="text-xs font-normal text-slate-400"> / day</span></span>
              </div>
              <button 
                onClick={() => navigate("/booking", { state: { car: selectedCar } })}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}