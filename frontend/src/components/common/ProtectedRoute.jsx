// // // import React from 'react';
// // // import { Navigate } from 'react-router-dom';
// // // import { useAuth } from '../../context/AuthContext';

// // // export const ProtectedRoute = ({ children, allowedRoles }) => {
// // //   const { user } = useAuth();
// // //   if (!user) return <Navigate to="/login" replace />;
// // //   if (allowedRoles && !allowedRoles.includes(user.role)) {
// // //     return <Navigate to="/" replace />;
// // //   }
// // //   return children;
// // // };

// // import React from 'react';
// // import { Navigate, Outlet } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';

// // export const ProtectedRoute = ({ allowedRoles, children }) => {
// //   const { user, loading } = useAuth();

// //   // 1. Agar context abhi localStorage se user check kar raha hai, toh redirect mat karo
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-slate-50">
// //         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
// //       </div>
// //     );
// //   }

// //   // 2. Agar token/user hai hi nahi, tabhi login par bhejo
// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   // 3. Role check (Case-insensitive taaki 'Student' vs 'student' clash na ho)
// //   if (allowedRoles && allowedRoles.length > 0) {
// //     const userRole = (user.role || '').toLowerCase();
// //     const roles = allowedRoles.map((r) => r.toLowerCase());

// //     if (!roles.includes(userRole)) {
// //       // Agar teacher student page kholne ki koshish kare ya vice-versa
// //       return <Navigate to={userRole === 'teacher' ? '/teacher' : '/student'} replace />;
// //     }
// //   }

// //   // Sab theek hai toh dashboard load hone do
// //   return children ? children : <Outlet />;
// // };

// // export default ProtectedRoute;

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export const ProtectedRoute = ({ allowedRole, allowedRoles, children }) => {
//   const { user, loading } = useAuth();

//   // 1. Loading check
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // 2. Unauthenticated check
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // 3. Normalize single allowedRole or array allowedRoles
//   const roles = [];
//   if (allowedRole) roles.push(allowedRole.toLowerCase());
//   if (allowedRoles && Array.isArray(allowedRoles)) {
//     roles.push(...allowedRoles.map((r) => r.toLowerCase()));
//   }

//   // 4. Role validation
//   if (roles.length > 0) {
//     const userRole = (user.role || '').toLowerCase();
//     if (!roles.includes(userRole)) {
//       return <Navigate to={userRole === 'teacher' ? '/teacher' : '/student'} replace />;
//     }
//   }

//   // 5. Allow access to Dashboard
//   return children ? children : <Outlet />;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRole, allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Agar context abhi user fetch kar raha hai, toh wait karein (Login par mat bhejo)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Agar user null hai, tabhi login par bhejo
  if (!user) {
    console.log("ProtectedRoute Reject: User is null");
    return <Navigate to="/login" replace />;
  }

  // Allowed roles collect karein (chahe allowedRole ho ya allowedRoles)
  const targetRoles = [];
  if (allowedRole) targetRoles.push(allowedRole.toLowerCase());
  if (allowedRoles && Array.isArray(allowedRoles)) {
    targetRoles.push(...allowedRoles.map((r) => r.toLowerCase()));
  }

  const currentRole = (user.role || '').toLowerCase();
  console.log("ProtectedRoute Check:", { currentRole, targetRoles });

  if (targetRoles.length > 0 && !targetRoles.includes(currentRole)) {
    console.log("ProtectedRoute Reject: Role mismatch", { currentRole, targetRoles });
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;