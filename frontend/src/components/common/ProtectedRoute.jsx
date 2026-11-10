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