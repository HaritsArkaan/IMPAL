import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const AdminHeader = ({ onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!Cookies.get('token'));
    };
    
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-300 ${
      isScrolled ? 'py-2' : 'py-4'
    }`}>
      <div className={`container mx-auto px-4 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Snack Hunt Logo"
              className={`transition-all duration-300 object-contain ${
                isScrolled ? 'w-[120px] h-[60px]' : 'w-[140px] h-[80px]'
              }`}
            />
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search food items..."
                className="w-full bg-[#E1E9DB] pr-10 pl-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
          
          {/* Admin Profile Section */}
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="text-gray-700 hover:text-green-500 transition-colors duration-300"
                >
                  <UserCircle size={52} />
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
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
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