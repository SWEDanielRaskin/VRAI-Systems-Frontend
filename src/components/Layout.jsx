import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  // Main dashboard layout
  const isScrollLocked =
    location.pathname === '/messages' || location.pathname === '/voice-calls';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content - now full width, sidebar removed */}
      <div className={`flex-1${isScrollLocked ? '' : ' overflow-auto'}`}>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
