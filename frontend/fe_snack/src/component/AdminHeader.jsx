import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Cookies from 'js-cookie';
import { IconUserCircle } from "@tabler/icons-react";

const AdminHeader = ({ onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!Cookies.get('token'));
    };
    
    checkLoginStatus();
    
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    window.location.href = '/dashboard';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/admin" className="flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Snack Hunt Logo"
              className="w-[120px] h-[60px] object-contain"
            />
          </Link>
          
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search food items..."
                  className="w-full bg-[#E1E9DB] pr-8 pl-3 py-2 text-center rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </form>
          </div>
          
          {/* Admin Profile Section */}
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="text-black hover:text-gray-700 rounded-full p-1"
                >
                  <IconUserCircle size={55} stroke={1.5} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#E1E9DB] hover:bg-[#d4dece] rounded-full text-sm px-4 py-2 inline-block"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

