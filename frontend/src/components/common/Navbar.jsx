import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { CheckCircle2, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
            QuickExam
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/about" className="hover:text-indigo-600">About Platform</Link>
          <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <User className="h-4 w-4 text-indigo-600" />
                {user.name} ({user.role})
              </span>
              <Button
                variant="ghost"
                onClick={() => { logout(); navigate('/login'); }}
                className="text-slate-500 hover:text-rose-600 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost">Log In</Button></Link>
              <Link to="/register"><Button variant="primary">Register</Button></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
