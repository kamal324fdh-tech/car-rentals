import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_CARS = [
  {
    id: 1,
    name: "Rolls-Royce Phantom",
    type: "Luxury",
    price: 1500,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Ultra-luxury sedan with handcrafted interiors, whisper-quiet comfort, and unmatched executive presence.",
  },
  {
    id: 2,
    name: "Bugatti Chiron",
    type: "Luxury",
    price: 5000,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "A hypercar monster producing extreme speed with quad-turbo W16 engineering and iconic aerodynamic styling.",
  },
  {
    id: 3,
    name: "Lamborghini Aventador",
    type: "Luxury",
    price: 2200,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Aggressive V12 supercar built for dramatic acceleration, exotic design, and thrilling road presence.",
  },
  {
    id: 4,
    name: "Ferrari SF90 Stradale",
    type: "Luxury",
    price: 2600,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Hybrid Ferrari performance machine combining Formula 1 technology with futuristic Italian craftsmanship.",
  },
  {
    id: 5,
    name: "McLaren 720S",
    type: "Luxury",
    price: 1800,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Lightweight aerodynamic supercar engineered for razor-sharp cornering and breathtaking acceleration.",
  },
  {
    id: 6,
    name: "Koenigsegg Jesko",
    type: "Luxury",
    price: 6500,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Extreme hypercar built for world-record speeds using advanced carbon fiber and twin-turbo V8 power.",
  },
  {
    id: 7,
    name: "Pagani Huayra",
    type: "Luxury",
    price: 7000,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "An exotic masterpiece blending handcrafted artistry with a thunderous AMG twin-turbo engine.",
  },
  {
    id: 8,
    name: "Bentley Continental GT",
    type: "Luxury",
    price: 950,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Luxury grand tourer featuring handcrafted leather interiors and smooth high-speed cruising comfort.",
  },
  {
    id: 9,
    name: "Mercedes-Benz G-Class",
    type: "SUV",
    price: 850,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Legendary luxury SUV with commanding road presence, premium interiors, and off-road dominance.",
  },
  {
    id: 10,
    name: "Range Rover Autobiography",
    type: "SUV",
    price: 780,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Premium British SUV combining refined luxury with powerful all-terrain driving capability.",
  },
  {
    id: 11,
    name: "Cadillac Escalade",
    type: "SUV",
    price: 500,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Large luxury SUV offering bold styling, advanced tech, and spacious executive comfort.",
  },
  {
    id: 12,
    name: "BMW X7",
    type: "SUV",
    price: 420,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Three-row luxury SUV packed with premium comfort, intelligent driving systems, and twin-turbo power.",
  },
  {
    id: 13,
    name: "Audi Q8",
    type: "SUV",
    price: 390,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Sporty luxury SUV featuring sleek coupe-inspired styling and advanced quattro handling systems.",
  },
  {
    id: 14,
    name: "Tesla Model S Plaid",
    type: "Electric",
    price: 450,
    transmission: "Automatic",
    fuel: "Electric",
    description: "High-performance electric sedan delivering insane acceleration, futuristic tech, and long driving range.",
  },
  {
    id: 15,
    name: "Tesla Cybertruck",
    type: "Electric",
    price: 600,
    transmission: "Automatic",
    fuel: "Electric",
    description: "Futuristic stainless-steel electric truck designed for durability, utility, and extreme performance.",
  },
  {
    id: 16,
    name: "Porsche Taycan Turbo S",
    type: "Electric",
    price: 520,
    transmission: "Automatic",
    fuel: "Electric",
    description: "Luxury electric sports sedan offering instant acceleration and precision Porsche driving dynamics.",
  },
  {
    id: 17,
    name: "Lucid Air Grand Touring",
    type: "Electric",
    price: 480,
    transmission: "Automatic",
    fuel: "Electric",
    description: "Premium EV known for industry-leading range, futuristic cabin design, and smooth ride comfort.",
  },
  {
    id: 18,
    name: "Rivian R1T",
    type: "Electric",
    price: 430,
    transmission: "Automatic",
    fuel: "Electric",
    description: "Adventure-focused electric pickup with quad-motor capability and rugged outdoor utility features.",
  },
  {
    id: 19,
    name: "Toyota Land Cruiser",
    type: "SUV",
    price: 350,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Globally respected SUV built for durability, reliability, and powerful off-road performance.",
  },
  {
    id: 20,
    name: "Jeep Wrangler",
    type: "SUV",
    price: 240,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Iconic off-road SUV designed for rugged trails, removable roof freedom, and adventure driving.",
  },
  {
    id: 21,
    name: "Ford Mustang Shelby GT500",
    type: "Luxury",
    price: 550,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "American muscle icon powered by a supercharged V8 delivering raw straight-line performance.",
  },
  {
    id: 22,
    name: "Chevrolet Corvette Stingray",
    type: "Luxury",
    price: 400,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Mid-engine sports car offering exotic styling and incredible speed at an affordable supercar tier.",
  },
  {
    id: 23,
    name: "Nissan GT-R",
    type: "Luxury",
    price: 620,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Legendary Japanese performance machine known for brutal acceleration and all-wheel-drive grip.",
  },
  {
    id: 24,
    name: "Toyota Supra",
    type: "Luxury",
    price: 280,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Modern sports coupe blending aggressive turbocharged performance with sleek aerodynamic styling.",
  },
  {
    id: 25,
    name: "Honda NSX",
    type: "Luxury",
    price: 750,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Hybrid Japanese supercar engineered for balanced handling and instant electric-assisted acceleration.",
  },
  {
    id: 26,
    name: "Toyota Camry",
    type: "Economy",
    price: 90,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Reliable midsize sedan delivering comfort, fuel efficiency, and practical everyday driving.",
  },
  {
    id: 27,
    name: "Honda Civic",
    type: "Economy",
    price: 75,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Popular compact car offering sporty styling, fuel economy, and dependable daily performance.",
  },
  {
    id: 28,
    name: "Toyota Corolla",
    type: "Economy",
    price: 70,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "One of the world's best-selling cars known for reliability, affordability, and low maintenance.",
  },
  {
    id: 29,
    name: "Hyundai Elantra",
    type: "Economy",
    price: 68,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Stylish compact sedan packed with modern tech and efficient fuel-saving engineering.",
  },
  {
    id: 30,
    name: "Kia Sportage",
    type: "SUV",
    price: 120,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Compact SUV with futuristic design, practical storage, and advanced driver-assistance features.",
  },
  {
    id: 31,
    name: "Hyundai Tucson",
    type: "SUV",
    price: 115,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Versatile family SUV featuring sharp styling, comfort-focused interiors, and hybrid efficiency.",
  },
  {
    id: 32,
    name: "Mazda CX-5",
    type: "SUV",
    price: 125,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Premium-feeling compact SUV delivering sporty handling and refined cabin craftsmanship.",
  },
  {
    id: 33,
    name: "Volkswagen Golf GTI",
    type: "Economy",
    price: 95,
    transmission: "Manual",
    fuel: "Gasoline",
    description: "Legendary hot hatch balancing compact practicality with exciting turbocharged driving dynamics.",
  },
  {
    id: 34,
    name: "Subaru WRX",
    type: "Economy",
    price: 110,
    transmission: "Manual",
    fuel: "Gasoline",
    description: "Rally-inspired sports sedan with turbocharged power and confidence-inspiring all-wheel drive.",
  },
  {
    id: 35,
    name: "Mini Cooper",
    type: "Economy",
    price: 88,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Fun compact hatchback delivering go-kart handling and iconic British-inspired design.",
  },
    {
    id: 36,
    name: "Toyota RAV4",
    type: "SUV",
    price: 118,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Reliable compact SUV with excellent fuel economy, spacious seating, and smooth everyday practicality.",
  },
  {
    id: 37,
    name: "Honda Accord",
    type: "Economy",
    price: 92,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Comfort-focused midsize sedan delivering refined driving, modern technology, and strong fuel efficiency.",
  },
  {
    id: 38,
    name: "BMW M4 Competition",
    type: "Luxury",
    price: 680,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "High-performance German coupe engineered with aggressive styling and precision track-ready handling.",
  },
  {
    id: 39,
    name: "Mercedes-Benz S-Class",
    type: "Luxury",
    price: 980,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Flagship luxury sedan loaded with advanced technology, executive comfort, and ultra-smooth performance.",
  },
  {
    id: 40,
    name: "Audi RS7",
    type: "Luxury",
    price: 760,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Luxury performance sportback combining sleek styling with explosive twin-turbo acceleration.",
  },
  {
    id: 41,
    name: "Ford F-150 Raptor",
    type: "SUV",
    price: 310,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Extreme off-road pickup truck built with rugged suspension systems and powerful desert-running capability.",
  },
  {
    id: 42,
    name: "Chevrolet Tahoe",
    type: "SUV",
    price: 280,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Full-size family SUV offering massive interior space, towing power, and premium driving comfort.",
  },
  {
    id: 43,
    name: "Volvo XC90",
    type: "SUV",
    price: 260,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Elegant Scandinavian SUV focused on luxury, advanced safety systems, and efficient hybrid performance.",
  },
  {
    id: 44,
    name: "Maserati Levante",
    type: "Luxury",
    price: 720,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Italian luxury SUV delivering exotic styling, sporty handling, and signature Maserati exhaust sound.",
  },
  {
    id: 45,
    name: "Aston Martin DB11",
    type: "Luxury",
    price: 1400,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Elegant grand tourer blending handcrafted British luxury with powerful twin-turbo performance.",
  },
  {
    id: 46,
    name: "Ferrari 812 Superfast",
    type: "Luxury",
    price: 3200,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Front-engine V12 Ferrari engineered for extreme speed, razor-sharp handling, and iconic styling.",
  },
  {
    id: 47,
    name: "Lexus RX",
    type: "SUV",
    price: 210,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Smooth and dependable luxury SUV with premium comfort, quiet driving, and excellent reliability.",
  },
  {
    id: 48,
    name: "Toyota Hilux",
    type: "SUV",
    price: 170,
    transmission: "Automatic",
    fuel: "Diesel",
    description: "Legendary pickup truck known worldwide for toughness, durability, and dependable off-road capability.",
  },
  {
    id: 49,
    name: "Chevrolet Camaro ZL1",
    type: "Luxury",
    price: 480,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Aggressive American muscle car powered by a supercharged V8 delivering thrilling acceleration.",
  },
  {
    id: 50,
    name: "Dodge Challenger Hellcat",
    type: "Luxury",
    price: 620,
    transmission: "Automatic",
    fuel: "Gasoline",
    description: "Iconic muscle coupe with massive horsepower, loud exhaust notes, and brutal straight-line speed.",
  }
];

export default function Cars() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  
  // Holds the verified user identity locally
  const [userProfile, setUserProfile] = useState(null);

  // Initialize favorites from localStorage so they persist
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("car_favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Tracks which car is currently opened in the Details Panel
  const [selectedCar, setSelectedCar] = useState(null);

  // =========================================================================
  // SECURITY & IDENTITY HOOK
  // =========================================================================
  useEffect(() => {
    const activeToken = localStorage.getItem("velocity_token");
    const activeUser = localStorage.getItem("velocity_user");

    // Route Protection: Keep unauthorized people out
    if (!activeToken) {
      navigate("/"); 
      return;
    }

    if (activeUser) {
      setUserProfile(JSON.parse(activeUser));
    }

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("car_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredCars = useMemo(() => {
    return MOCK_CARS.filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "All" || car.type === selectedType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === "low-high") return a.price - b.price;
      if (sortBy === "high-low") return b.price - a.price;
      return 0;
    });
  }, [search, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white scroll-smooth relative overflow-x-hidden">
      
      {/* 1. TOP HEADER SECTION */}
      <header className="relative py-24 sm:py-32 border-b border-slate-900 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
            {userProfile ? `Welcome, ${userProfile.name} • Active Profile` : "Curated Fleet"}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Available Cars
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Choose from our wide range of premium and economy vehicles, fully optimized for your performance and luxury needs.
          </p>

          <div className="pt-6 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by make or model (e.g., Porsche)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 shadow-inner"
            />
            <div className="absolute right-4 top-[38px] text-slate-500 text-sm font-semibold pointer-events-none">
              ⌘F
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      </header>

      {/* 2. FILTER & SORT CONTROL HUB SECTION */}
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

      {/* 3. CARS GRID SECTION & CONTROLS */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                </div>
                <div className="flex gap-3 pt-4">
                  <div className="h-11 bg-slate-800 rounded-xl flex-1"></div>
                  <div className="h-11 bg-slate-800 rounded-xl flex-1"></div>
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
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                      {car.name}
                    </h3>
                    
                    <button
                      type="button"
                      onClick={() => toggleFavorite(car.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 transition-colors focus:outline-none"
                    >
                      <span className="sr-only">Favorite</span>
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
                    <span className="text-[10px] font-medium text-slate-500">
                      • {car.transmission}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      • {car.fuel}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
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
                    {/* REDIRECTS TO SECURE CHECKOUT WITH CAR ATTACHED */}
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
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto text-lg font-bold">
              ?
            </div>
            <h2 className="text-xl font-bold text-white">No vehicles found</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              We couldn't locate matching models under your selected specifications. Try clearing your search string or picking a separate category filter tag.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("All");
                  setSortBy("default");
                }}
                className="text-xs font-bold tracking-wider uppercase text-blue-500 hover:text-blue-400 underline transition"
              >
                Reset System Filters
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* SIDE-OVER DETAILS PANEL VIEW                                              */}
      {/* ========================================================================= */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCar(null)}
          />

          <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800/80 p-8 overflow-y-auto shadow-2xl flex flex-col justify-between z-10">
            
            <div>
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{selectedCar.type} Class</span>
                  <h2 className="text-2xl font-black text-white mt-1 tracking-tight">{selectedCar.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedCar(null)}
                  className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 border border-slate-800/80 bg-slate-950/40 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center text-center">
                  <div className="flex-1 border-r border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">Top Tier</span>
                    <span className="text-base font-black text-white mt-0.5 block">V-Max Spec</span>
                  </div>
                  <div className="flex-1 border-r border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">Engine Setup</span>
                    <span className="text-base font-black text-white mt-0.5 block">Optimized</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">Handling</span>
                    <span className="text-base font-black text-white mt-0.5 block">AWD / RWD</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Vehicle Profile Overview</h4>
                <p className="text-sm text-slate-300 font-light leading-relaxed">{selectedCar.description}</p>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Core Technical Specs</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/40 border border-slate-850/60 p-3.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Transmission Link</span>
                    <span className="text-sm text-white font-bold mt-0.5 block">{selectedCar.transmission}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-850/60 p-3.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Fuel / Energy Source</span>
                    <span className="text-sm text-white font-bold mt-0.5 block">{selectedCar.fuel}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-850/60 p-3.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Chassis Engineering</span>
                    <span className="text-sm text-white font-bold mt-0.5 block">Lightweight Matrix</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-850/60 p-3.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Availability Status</span>
                    <span className="text-sm text-emerald-400 font-bold mt-0.5 block">🟢 Ready for Fleet Delivery</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Included Tech Package Options</h4>
                <div className="flex flex-wrap gap-2">
                  {["ADVANCED AUTOPILOT ASSIST", "360° ACOUSTIC SOUNDSTAGE", "ADAPTIVE AIR MANAGEMENT", "INTELLIGENT SYNC HUBS"].map((feat) => (
                    <span key={feat} className="text-[10px] tracking-wider bg-slate-950 border border-slate-850 text-slate-400 px-3 py-2 rounded-lg font-medium">
                      [ {feat} ]
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-850 pt-6 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Premium Rental Guidelines</h4>
                <ul className="text-xs text-slate-400 space-y-1.5 font-light">
                  <li className="flex items-center gap-2">🛡️ <span className="text-slate-300 font-medium">Security Deposit:</span> $500 pre-authorization hold verified on launch day.</li>
                  <li className="flex items-center gap-2">📋 <span className="text-slate-300 font-medium">Insurance Profile:</span> Full comprehensive collision waiver coverage included.</li>
                  <li className="flex items-center gap-2">🛣️ <span className="text-slate-300 font-medium">Distance Limit:</span> 150 miles/day allocation allowance.</li>
                </ul>
              </div>

            </div>

            {/* SIDE PANEL CHECKOUT ACTION BUTTON */}
            <div className="pt-6 border-t border-slate-800 mt-12 flex items-center justify-between gap-4 bg-slate-900">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Calculated Base Rate</span>
                <span className="text-2xl font-black text-white">${selectedCar.price}<span className="text-xs font-normal text-slate-400"> / day</span></span>
              </div>
              <button 
                onClick={() => navigate("/booking", { state: { car: selectedCar } })}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 text-center"
              >
                Confirm Reservation Dates
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}