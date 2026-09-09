import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Compass, Calendar, Bell, Settings, 
  LogOut, Search, CheckCircle, Clock, ShieldAlert, Car, Plus, Trash2, Users
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const initialUsersBackup = [
  { no: '01', name: 'Alex Noman (Fallback)', email: 'alex@gmail.com', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', status: 'Active', accountType: 'Verified Customer' }
];

const systemFleetBackup = [
  { name: 'Toyota Camry (Fallback)', status: 'Available' }
];

const earningData = [{ name: 'May', last6Months: 100000 }, { name: 'Jun', last6Months: 180000 }, { name: 'Jul', last6Months: 130000 }, { name: 'Aug', last6Months: 210000 }, { name: 'Sep', last6Months: 190000 }, { name: 'Oct', last6Months: 240000 }];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [userAccounts, setUserAccounts] = useState(initialUsersBackup);
  const [fleetInventory, setFleetInventory] = useState(systemFleetBackup);
  const [selectedCarName, setSelectedCarName] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [stats, setStats] = useState({ carsAvailable: 0, carsDispatched: 0, carsInCompany: 0 });

  // Drivers Domain States
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', licenseNumber: '', status: 'Active' });

  // Central Sync Pipeline
  const fetchAllData = async () => {
    try {
      const userRes = await fetch('http://localhost:5000/api/users'); 
      if (userRes.ok) setUserAccounts(await userRes.json()); 

      const statsRes = await fetch('http://localhost:5000/api/fleet/stats');
      if (statsRes.ok) setStats(await statsRes.json());

      const fleetRes = await fetch('http://localhost:5000/api/fleet/inventory');
      if (fleetRes.ok) setFleetInventory(await fleetRes.json());

      const driversRes = await fetch('http://localhost:5000/api/drivers');
      if (driversRes.ok) setDrivers(await driversRes.json());
    } catch (error) {
      console.warn("Backend server connection missing. Utilizing safe fallbacks.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCheckCarAvailability = (e) => {
    e.preventDefault();
    if (!selectedCarName.trim()) return;
    const searchCar = fleetInventory.find(c => c.name.toLowerCase().includes(selectedCarName.toLowerCase()));
    if (searchCar) {
      setAvailabilityMessage(searchCar.status === 'Available' ? `✅ ${searchCar.name} is available!` : `❌ ${searchCar.name} is [${searchCar.status}]`);
    } else {
      setAvailabilityMessage(`❓ "${selectedCarName}" not found.`);
    }
  };

  // Add Driver Form Handler
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver)
      });
      if (res.ok) {
        setNewDriver({ name: '', email: '', phone: '', licenseNumber: '', status: 'Active' });
        fetchAllData(); // Refresh list dynamically
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (err) {
      console.error("Failed to add driver natively", err);
    }
  };

  // Delete Driver Handler
  const handleDeleteDriver = async (id) => {
    if (!confirm("Are you sure you want to remove this driver from deployment records?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#D1E0D4] font-sans p-6 items-center justify-center">
      <div className="w-full max-w-6xl bg-[#F6F6F6] rounded-3xl shadow-xl flex overflow-hidden min-h-[750px]">
        
        {/* SIDEBAR NAVIGATION SYSTEM */}
        <aside className="w-60 bg-[#161618] text-gray-400 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-8 px-2">
              <span className="text-blue-500 text-2xl">⚡</span> VELOCITY
            </div>
            <nav className="space-y-1">
              {[
                { name: 'Dashboard', icon: LayoutDashboard },
                { name: 'Drivers', icon: Compass },
                { name: 'Bookings', icon: Calendar },
                { name: 'Notifications', icon: Bell },
                { name: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl font-medium transition-all ${
                      activeTab === item.name ? 'bg-[#2F80ED] text-white' : 'hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium"><LogOut className="w-4 h-4" /> Logout</button>
        </aside>

        {/* WORKSPACE FRAMEWORK PANEL */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Company Operations Console</h2>
              <p className="text-xs text-gray-400">Live Database Context Panel: {activeTab}</p>
            </div>
          </header>

          {/* DASHBOARD TAB VIEW */}
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-400 font-medium">Cars Available</div>
                  <div className="mt-2 text-3xl font-extrabold text-gray-900">{stats.carsAvailable}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-400 font-medium">Cars Dispatched</div>
                  <div className="mt-2 text-3xl font-extrabold text-gray-900">{stats.carsDispatched}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-400 font-medium">Total System Fleet Size</div>
                  <div className="mt-2 text-3xl font-extrabold text-gray-900">{stats.carsInCompany}</div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-800 mb-3">Check Car Availability</h3>
                  <form onSubmit={handleCheckCarAvailability} className="flex gap-3">
                    <input type="text" placeholder="Enter Car Name..." value={selectedCarName} onChange={(e) => setSelectedCarName(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"/>
                    <button type="submit" className="bg-[#2F80ED] text-white text-xs px-6 py-2 rounded-xl">Search</button>
                  </form>
                  {availabilityMessage && <p className="mt-2 text-xs font-semibold text-blue-600">{availabilityMessage}</p>}
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-800 mb-3">Registered App Accounts</h3>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-50"><th className="pb-2">ID</th><th className="pb-2">Profile Name</th><th className="pb-2">Email Address</th></tr>
                    </thead>
                    <tbody>
                      {userAccounts.map((user) => (
                        <tr key={user.no} className="border-b border-gray-50/50"><td className="py-2 text-gray-400 font-mono">{user.no}</td><td className="py-2 font-bold text-gray-900">{user.name}</td><td className="py-2 font-mono text-gray-500">{user.email}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BRAND NEW DRIVERS TAB VIEW */}
          {activeTab === 'Drivers' && (
            <div className="grid grid-cols-12 gap-6">
              
              {/* DRIVER ENTRY MANIFEST REGISTER FORM */}
              <div className="col-span-12 md:col-span-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-500" /> Onboard New Driver
                  </h3>
                  <form onSubmit={handleAddDriver} className="space-y-3">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">DRIVERS FULL NAME</label>
                      <input required type="text" placeholder="John Doe" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">EMAIL ADDRESS</label>
                      <input required type="email" placeholder="johndoe@velocity.com" value={newDriver.email} onChange={e => setNewDriver({...newDriver, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">PHONE NUMBER</label>
                      <input required type="text" placeholder="+1 (555) 000-0000" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">LICENSE SERIAL ID</label>
                      <input required type="text" placeholder="DL-000000X" value={newDriver.licenseNumber} onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">DISPATCH CAPABILITY</label>
                      <select value={newDriver.status} onChange={e => setNewDriver({...newDriver, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                        <option value="Active">Active / On-Call</option>
                        <option value="On Trip">Dispatched Out</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-[#2F80ED] text-white text-xs py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors mt-2">Deploy Fleet Operative</button>
                  </form>
                </div>
              </div>

              {/* LIVE DRIVERS DIRECTORY TABLE LIST */}
              <div className="col-span-12 md:col-span-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-800 mb-4 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-500" /> Active Active Rosters ({drivers.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-100 font-normal">
                          <th className="pb-3">Operative Name</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">License Key</th>
                          <th className="pb-3">Telemetry State</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                        {drivers.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-8 text-gray-400">No active drivers found. Click seed or add a driver!</td></tr>
                        ) : (
                          drivers.map((driver) => (
                            <tr key={driver._id} className="hover:bg-gray-50/50">
                              <td className="py-3 font-bold text-gray-900">{driver.name}</td>
                              <td className="py-3 font-mono text-gray-500 text-[11px]">
                                <div>{driver.email}</div>
                                <div className="text-gray-400">{driver.phone}</div>
                              </td>
                              <td className="py-3 font-mono text-gray-400 text-[11px]">{driver.licenseNumber}</td>
                              <td className="py-3">
                                <span className="flex items-center gap-1">
                                  {driver.status === 'Active' && <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-500" />}
                                  {driver.status === 'On Trip' && <Clock className="w-3 h-3 text-blue-500 fill-blue-500" />}
                                  {driver.status === 'Suspended' && <ShieldAlert className="w-3 h-3 text-red-500 fill-red-500" />}
                                  <span className="text-[11px] text-gray-600">{driver.status}</span>
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button onClick={() => handleDeleteDriver(driver._id)} className="text-red-500 hover:text-red-700 p-1 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* INACTIVE FALLBACK CAPTURES */}
          {activeTab !== 'Dashboard' && activeTab !== 'Drivers' && (
            <div className="bg-white p-12 rounded-3xl text-center text-gray-400">Terminal Panel under active build lifecycle.</div>
          )}
        </main>
      </div>
    </div>
  );
}