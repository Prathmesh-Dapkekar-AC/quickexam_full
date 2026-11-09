
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { LayoutDashboard, LogOut, CheckCircle2, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User role ke hisaab se dashboard route select karein
  const dashboardPath = user?.role === 'teacher' ? '/teacher' : '/student';
  const isCurrentlyOnDashboard = location.pathname === dashboardPath;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-indigo-700 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight leading-tight text-base">QuickExam</span>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wider uppercase">Assessment Engine</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link 
              to="/" 
              className={`transition hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600 font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition hover:text-indigo-600 ${location.pathname === '/about' ? 'text-indigo-600 font-semibold' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition hover:text-indigo-600 ${location.pathname === '/contact' ? 'text-indigo-600 font-semibold' : ''}`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Dashboard Button (Sirf tabhi dikhega jab user kisi doosre page par ho) */}
              {!isCurrentlyOnDashboard && (
                <Link to={dashboardPath}>
                  <Button 
                    size="sm" 
                    className="h-9 px-3.5 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-xs">Dashboard</span>
                  </Button>
                </Link>
              )}

              {/* Modern User Pill: Initial icon + Name & Role */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 h-9">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                  {user.name ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col leading-tight justify-center">
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium capitalize -mt-0.5">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="h-9 px-3 gap-1.5 text-slate-600 border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/80 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="h-9 text-slate-700 hover:text-indigo-600 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
