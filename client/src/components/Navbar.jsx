import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = location.pathname.startsWith('/dashboard') || location.pathname === '/ai-assistant' || location.pathname === '/markets' || location.pathname === '/settings' || location.pathname === '/portofolio';

  const { data: userData } = useSelector(state => state.wallet) || { data: { fullName: '', Profile: { username: '' } } };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <Logo variant="compact" size="small" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/dashboard'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-cyan-400'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/markets"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/markets'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-cyan-400'
                  }`}
                >
                  Markets
                </Link>
                <Link
                  to="/portofolio"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/portofolio'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-cyan-400'
                  }`}
                >
                  Portfolio
                </Link>
                <Link
                  to="/ai-assistant"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/ai-assistant'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-cyan-400'
                  }`}
                >
                  AI Assistant
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  Pricing
                </Link>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  About
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">

                {/* User Profile Card */}
                <div className="relative group">
                  <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{getInitials(userData.fullName)}</span>
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-white text-sm font-medium">{userData.fullName || userData.Profile?.username}</div>
                      <div className="text-slate-400 text-xs">Premium</div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <hr className="border-slate-700 my-2" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors w-full text-left">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-slate-400 hover:text-cyan-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;