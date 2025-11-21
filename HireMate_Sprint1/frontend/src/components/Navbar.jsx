import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await api.post('/register/logout');
    } catch (error) {
      // ignore
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      window.dispatchEvent(new Event('hiremate:user-change'));
      navigate('/login');
    }
  };

  const activeStyles = useMemo(() => {
    const base =
      user?.role === 'company'
        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80';
    const active =
      user?.role === 'company'
        ? 'text-white bg-gradient-to-r from-violet-600/60 to-indigo-600/60 shadow-lg'
        : 'text-emerald-700 bg-emerald-50/90 shadow-sm';
    return { base, active };
  }, [user]);

  const navThemeClass =
    user?.role === 'company'
      ? 'bg-slate-900/60 border-slate-800/60 shadow-2xl'
      : 'bg-white/90 border-white/60 shadow-lg';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${navThemeClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow ${
                  user?.role === 'company'
                    ? 'bg-gradient-to-br from-slate-800 to-indigo-700 text-white'
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                }`}
              >
                <span className="font-black text-xl">H</span>
              </div>
              <span
                className={`text-2xl font-bold ${
                  user?.role === 'company'
                    ? 'text-white'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
                }`}
              >
                HireMate
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/') ? activeStyles.active : activeStyles.base
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/jobs') ? activeStyles.active : activeStyles.base
              }`}
            >
              Jobs
            </Link>
            {user?.role === 'company' && (
              <Link
                to="/post-job"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/post-job') ? activeStyles.active : activeStyles.base
                }`}
              >
                Post Job
              </Link>
            )}
            {user?.role === 'job_seeker' && (
              <Link
                to="/my-applications"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/my-applications') ? activeStyles.active : activeStyles.base
                }`}
              >
                My Applications
              </Link>
            )}
            {user?.role === 'company' && (
              <Link
                to="/company/qualified"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/company/qualified') ? activeStyles.active : activeStyles.base
                }`}
              >
                Qualified
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span
                  className={`text-sm ${
                    user?.role === 'company' ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  Hi, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    user?.role === 'company'
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/70'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    user?.role === 'company'
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/70'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2.5 text-sm font-semibold rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    user?.role === 'company'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
