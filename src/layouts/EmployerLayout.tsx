import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import EmployerMobileNav from '../components/EmployerMobileNav';
import toast from 'react-hot-toast';

const EmployerLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { profile, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkCompanyProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      // Skip check if already on company-details page
      if (location.pathname === '/employer/company-details' || 
          location.pathname === '/employer/reels' ||
          location.pathname === '/employer/saved-videos' ||
          location.pathname === '/employer/credits') {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .eq('auth_id', user.id)
          .maybeSingle();

        if (error || !data) {
          toast('Please complete your company profile to access employer features.');
          navigate('/employer/company-details');
          return;
        }
      } catch (err) {
        console.error('Error checking company profile:', err);
        toast('Error checking company profile. Please try again.');
        navigate('/employer/company-details');
      }
    };

    checkCompanyProfile();
  }, [user, navigate, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Top Navigation - Hidden on mobile */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div>
                <Link to="/employer" className="text-3xl font-bold text-emerald-600 tracking-tight">
                  Worldz
                </Link>
              </div>
              <button
                onClick={() => navigate('/')}
                className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                ← Switch to Jobseeker
              </button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out hover:bg-gray-100 active:bg-gray-200 shadow-sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-medium">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
                {isSettingsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/employer/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/employer/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white/80 backdrop-blur-md shadow-sm h-screen fixed">
          <div className="p-4">
            <nav className="space-y-1">
              <Link
                to="/employer/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                  isActive('/employer/dashboard') ? 'bg-emerald-50 text-emerald-600' : ''
                }`}
              >
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                to="/employer/jobs"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                  isActive('/employer/jobs') ? 'bg-emerald-50 text-emerald-600' : ''
                }`}
              >
                <span className="text-sm font-medium">Posted Jobs</span>
              </Link>
              <Link
                to="/employer/internships"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                  isActive('/employer/internships') ? 'bg-emerald-50 text-emerald-600' : ''
                }`}
              >
                <span className="text-sm font-medium">Posted Internships</span>
              </Link>
              <Link
                to="/employer/applications"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                  isActive('/employer/applications') ? 'bg-emerald-50 text-emerald-600' : ''
                }`}
              >
                <span className="text-sm font-medium">Applications</span>
              </Link>
              <Link
                to="/employer/billing"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200"
              >
                <span className="text-sm font-medium">Billing</span>
              </Link>
              <Link
                to="/employer/analytics"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200"
              >
                <span className="text-sm font-medium">Analytics</span>
              </Link>
              
              {/* Phase 3 Features - Reverse Hiring */}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reverse Hiring
                </div>
                <Link
                  to="/employer/reels"
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                    isActive('/employer/reels') ? 'bg-emerald-50 text-emerald-600' : ''
                  }`}
                >
                  <span className="text-sm font-medium">Job Seeker Reels</span>
                </Link>
                <Link
                  to="/employer/saved-videos"
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                    isActive('/employer/saved-videos') ? 'bg-emerald-50 text-emerald-600' : ''
                  }`}
                >
                  <span className="text-sm font-medium">Saved Videos</span>
                </Link>
                <Link
                  to="/employer/credits"
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors duration-200 ${
                    isActive('/employer/credits') ? 'bg-emerald-50 text-emerald-600' : ''
                  }`}
                >
                  <span className="text-sm font-medium">Credits</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <EmployerMobileNav />
    </div>
  );
};

export default EmployerLayout;