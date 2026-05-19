// import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   // 1. Look in the browser memory for the user's login ID card (token)
//   const token = localStorage.getItem('velocity_token');
  
//   // 2. If the token isn't there, they aren't logged in! 
//   // Kick them straight back to the login screen.
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // 3. If they have the token, let them through to see the dashboard page.
//   return children;
// }