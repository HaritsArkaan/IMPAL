import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Heart, UtensilsCrossed, SquareChartGantt } from 'lucide-react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(''); // State untuk username
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.sub || ''); // Simpan username dari token
        } catch (error) {
          console.error('Error decoding token:', error);
          setUsername('');
        }
      } else {
        setUsername('');
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
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
        width: 400,
        customClass: {
          popup: 'relative',
          title: 'text-xl text-gray-800 font-bold',
          content: 'text-gray-600',
          confirmButton: 'px-4 py-2 rounded-full transition-colors',
          cancelButton: 'px-4 py-2 rounded-full transition-colors',
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
    <header className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className={`container mx-auto px-4 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          {/* Left section with logo and navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="Snack Hunt Logo"
                className={`transition-all duration-300 object-contain ${isScrolled ? 'w-[140px] h-[60px]' : 'w-[180px] h-[100px]'}`}
              />
            </Link>

            {/* Navigation moved up next to logo */}
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => handleProtectedRoute('/add')} 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors duration-300"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Tambah Jajanan</span>
              </button>

              <button 
                onClick={() => handleProtectedRoute('/review')} 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors duration-300"
              >
                <SquareChartGantt className="h-5 w-5" />
                <span>Reviewku</span>
              </button>
              <button 
                onClick={() => handleProtectedRoute('/jajananku')} 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors duration-300"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Jajananku</span>
              </button>

              <button 
                onClick={() => handleProtectedRoute('/favoritku')} 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors duration-300"
              >
                <Heart className="h-5 w-5" />
                <span>Favoritku</span>
              </button>
            </nav>
          </div>

          {/* Right section with search and profile */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mau jajan apa hari ini?"
                  className="w-full bg-[#E1E9DB] pr-10 pl-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
            
            {isLoggedIn ? (
              <div className="relative flex items-center space-x-4" ref={dropdownRef}>
              <span className="text-gray-700 font-bold">{username}</span> {/* Tampilkan username */}
              <button onClick={toggleDropdown}>
                <img src="/profile.jpg" alt="Profile" className="w-16 h-16 rounded-full" />
              </button>
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%", // Posisi dropdown di bawah tombol
                    left: 0, // Sejajarkan ke kiri elemen induk
                    marginTop: "0.5rem", // Jarak kecil antara tombol dan dropdown
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 50, // Pastikan berada di atas elemen lainnya
                  }}
                  className="w-48 py-1"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
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
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
