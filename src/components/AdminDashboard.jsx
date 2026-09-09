// import React, { useState, useEffect } from 'react';

// function AdminDashboard() {
//   const [currentSection, setCurrentSection] = useState('overview');
//   const [fleet, setFleet] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(true);

//   // Form Fields
//   const [carName, setCarName] = useState('');
//   const [dailyRate, setDailyRate] = useState('');
//   const [carType, setCarType] = useState('Luxury');
//   const [gearbox, setGearbox] = useState('Automatic');
//   const [fuelType, setFuelType] = useState('Premium Gas');

//   // Pull live records from your API backend
//   useEffect(() => {
//     fetch('http://localhost:5000/api/cars')
//       .then(res => res.json())
//       .then(data => {
//         setFleet(data);
//         setIsProcessing(false);
//       })
//       .catch(err => {
//         console.error('API Error:', err);
//         setIsProcessing(false);
//       });
//   }, []);

//   const handleCreateCar = (e) => {
//     e.preventDefault();
//     if (!carName || !dailyRate) return alert('Please enter the car model and pricing');

//     const payload = {
//       name: carName,
//       price: Number(dailyRate),
//       type: carType,
//       transmission: gearbox,
//       fuel: fuelType,
//     };

//     fetch('http://localhost:5000/api/cars', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     })
//       .then(res => res.json())
//       .then(newCar => {
//         setFleet([...fleet, newCar]);
//         setCarName('');
//         setDailyRate('');
//       })
//       .catch(err => console.error('Error uploading car:', err));
//   };

//   if (isProcessing) {
//     return (
//       <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#090d16', fontFamily: 'system-ui, sans-serif' }}>
//         <p style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '500' }}>Loading your dashboard...</p>
//       </div>
//     );
//   }

//   const unitsAvailable = fleet.filter(item => item.available).length;

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', color: '#f8fafc' }}>
      
//       {/* SIDEBAR */}
//       <div style={{ width: '240px', backgroundColor: '#0d1527', borderRight: '1px solid #1e293b', padding: '32px 20px', display: 'flex', flexDirection: 'column' }}>
//         <div style={{ marginBottom: '36px', paddingLeft: '8px' }}>
//           <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: '#ffffff' }}>Velocity</h1>
//           <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Internal Fleet Manager</p>
//         </div>

//         <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//           <button 
//             onClick={() => setCurrentSection('overview')}
//             style={{ display: 'block', width: '100%', padding: '10px 12px', borderRadius: '6px', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
//               backgroundColor: currentSection === 'overview' ? '#1e293b' : 'transparent',
//               color: currentSection === 'overview' ? '#ffffff' : '#94a3b8',
//               transition: 'background-color 0.2s'
//             }}
//           >
//             Overview
//           </button>
//           <button 
//             onClick={() => setCurrentSection('fleet')}
//             style={{ display: 'block', width: '100%', padding: '10px 12px', borderRadius: '6px', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
//               backgroundColor: currentSection === 'fleet' ? '#1e293b' : 'transparent',
//               color: currentSection === 'fleet' ? '#ffffff' : '#94a3b8',
//               transition: 'background-color 0.2s'
//             }}
//           >
//             Manage Fleet ({fleet.length})
//           </button>
//         </nav>
//       </div>

//       {/* MAIN VIEWPORT */}
//       <div style={{ flex: 1, padding: '40px 48px', backgroundColor: '#090d16' }}>
        
//         {/* OVERVIEW MODULE */}
//         {currentSection === 'overview' && (
//           <div>
//             <div style={{ marginBottom: '32px' }}>
//               <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px' }}>Overview</h2>
//               <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>A quick snapshot of your rental performance today.</p>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
//               <div style={{ backgroundColor: '#0d1527', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
//                 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Active Fleet Size</span>
//                 <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginTop: '8px' }}>{fleet.length}</div>
//               </div>
//               <div style={{ backgroundColor: '#0d1527', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
//                 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Available for Booking</span>
//                 <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80', marginTop: '8px' }}>{unitsAvailable}</div>
//               </div>
//               <div style={{ backgroundColor: '#0d1527', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
//                 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Out on Lease</span>
//                 <div style={{ fontSize: '32px', fontWeight: '700', color: '#f87171', marginTop: '8px' }}>{fleet.length - unitsAvailable}</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* FLEET MANAGEMENT MODULE */}
//         {currentSection === 'fleet' && (
//           <div>
//             <div style={{ marginBottom: '32px' }}>
//               <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px' }}>Manage Fleet</h2>
//               <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>Register new inventory blocks directly to your live website.</p>
//             </div>

//             {/* MODERN MINIMALIST DARK INPUT CARD */}
//             <form onSubmit={handleCreateCar} style={{ backgroundColor: '#0d1527', padding: '28px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '32px' }}>
//               <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Add New Vehicle</h3>
              
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
//                 <div>
//                   <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Car Model Name</label>
//                   <input type="text" placeholder="e.g., Audi RS6" value={carName} onChange={e => setCarName(e.target.value)} style={{ width: '90%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '14px', color: '#ffffff', outline: 'none' }} />
//                 </div>

//                 <div>
//                   <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Rate Per Day ($)</label>
//                   <input type="number" placeholder="e.g., 299" value={dailyRate} onChange={e => setDailyRate(e.target.value)} style={{ width: '90%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '14px', color: '#ffffff', outline: 'none' }} />
//                 </div>

//                 <div>
//                   <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Class</label>
//                   <select value={carType} onChange={e => setCarType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '14px', color: '#ffffff', outline: 'none', cursor: 'pointer' }}>
//                     <option value="Luxury">Luxury</option>
//                     <option value="SUV">SUV</option>
//                     <option value="Electric">Electric</option>
//                     <option value="Standard">Standard</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Gearbox</label>
//                   <select value={gearbox} onChange={e => setGearbox(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '14px', color: '#ffffff', outline: 'none', cursor: 'pointer' }}>
//                     <option value="Automatic">Automatic</option>
//                     <option value="Manual">Manual</option>
//                   </select>
//                 </div>
//               </div>

//               <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#090d16', border: 'none', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'opacity 0.2s' }}>
//                 Save Vehicle
//               </button>
//             </form>

//             {/* DARK MODE DATA TABLE */}
//             <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
//                 <thead>
//                   <tr style={{ backgroundColor: '#111c35', borderBottom: '1px solid #1e293b' }}>
//                     <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: '600' }}>Vehicle</th>
//                     <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: '600' }}>Classification</th>
//                     <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: '600' }}>Specifications</th>
//                     <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: '600' }}>Day Rate</th>
//                     <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: '600' }}>Availability</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fleet.map((car) => (
//                     <tr key={car._id} style={{ borderBottom: '1px solid #1e293b' }}>
//                       <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ffffff' }}>{car.name}</td>
//                       <td style={{ padding: '16px 20px', color: '#e2e8f0' }}>{car.type}</td>
//                       <td style={{ padding: '16px 20px', color: '#94a3b8' }}>{car.transmission} · {car.fuel}</td>
//                       <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ffffff' }}>${car.price}</td>
//                       <td style={{ padding: '16px 20px' }}>
//                         <span style={{ 
//                           backgroundColor: car.available ? 'rgba(22, 163, 74, 0.15)' : 'rgba(220, 38, 38, 0.15)', 
//                           color: car.available ? '#4ade80' : '#f87171', 
//                           padding: '4px 10px', 
//                           borderRadius: '20px', 
//                           fontSize: '12px', 
//                           fontWeight: '600' 
//                         }}>
//                           {car.available ? 'Available' : 'Rented'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;