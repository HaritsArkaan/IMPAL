import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Filter, PlusCircle, Heart, UserCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Check for token on component mount and when token changes
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!Cookies.get('token'));
    };
    
    // Check initially
    checkLoginStatus();
    
    // Set up an interval to check periodically
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    window.location.href = '/dashboard';
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
  };
  

  const handleProtectedRoute = (route) => {
  if (!isLoggedIn) {
    Swal.fire({
      title: 'Akses Terbatas',
      text: 'Anda perlu login untuk mengakses fitur ini',
      icon: 'warning',
      iconColor: '#70AE6E',
      showCancelButton: true,
      confirmButtonColor: '#70AE6E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Login Sekarang',
      cancelButtonText: 'Batal',
      background: '#f0f8ff',
      backdrop: `
        rgba(112,174,110,0.4)
        no-repeat
      `,
      customClass: {
        title: 'text-xl text-gray-800 font-bold',
        content: 'text-gray-600',
        confirmButton: 'px-4 py-2 rounded-full transition-colors',
        cancelButton: 'px-4 py-2 rounded-full transition-colors'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
  } else {
    navigate(route);
  }
};

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex-shrink-0">
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
                  placeholder="mau jajan apa hari ini?"
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
          
          {/* Login/Profile Section */}
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="text-black hover:text-gray-700 rounded-full p-1"
                >
                 <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
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
                Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8 px-4 py-2">
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 text-black-700 hover:text-gray-900 bg-white px-4 py-2 rounded-lg focus:outline-none"
            >
              <Menu className="h-4 w-4" />
              <span className="text-sm">Menu</span>
            </button>

            {isMenuOpen && (
              <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => handleProtectedRoute('/review')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Reviewku
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleProtectedRoute('/jajananku')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Jajanku
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleProtectedRoute('/add')} 
            className="flex items-center space-x-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm">Tambah Jajanan</span>
          </button>
          <button 
            onClick={() => handleProtectedRoute('/favoritku')} 
            className="flex items-center space-x-1"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm">Favoritku</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

