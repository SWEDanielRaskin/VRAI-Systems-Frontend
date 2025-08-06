import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Phone,
  MessageSquare,
  Settings,
  Bell,
  Package,
  LogOut,
} from 'lucide-react';
import { BUSINESS_NAME, PAGE_TITLES } from '../config';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Main dashboard layout
  const isScrollLocked =
    location.pathname === '/messages' || location.pathname === '/voice-calls';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header with logout button */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content - now full width, sidebar removed */}
      <div className={`flex-1${isScrollLocked ? '' : ' overflow-auto'}`}>
        <div className="p-6 pt-16">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
