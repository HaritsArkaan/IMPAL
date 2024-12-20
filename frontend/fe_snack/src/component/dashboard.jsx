import React, { useState } from 'react';
import Logo from "../photo/logo.jpg";
import Corndog from "../photo/corndog.jpg";
import Risol from "../photo/risol.jpg";
import Mie from "../photo/mie-rendang.jpg";
import Kelapa from "../photo/es-kelapa.jpg";
import { Link } from 'react-router-dom';
import { Search, Menu, Filter, PlusCircle, Heart, Star } from 'lucide-react';

function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <img
            src={Logo}
            alt="Snack Hunt Logo"
            className="w-[130px] h-[600px] object-contain"
          />
          <div className="flex w-full max-w-md items-center px-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="mau jajan apa hari ini?"
                className="w-full bg-[#E1E9DB] pr-8 pl-3 py-2 text-center rounded-full"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button className="bg-[#E1E9DB] hover:bg-[#d4dece] rounded-full text-sm px-4 py-2">
            <Link to="/login">Masuk</Link>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8 px-4 py-2">

          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-black-700 hover:text-gray-900 bg-white px-4 py-2 rounded-lg focus:outline-none"
            >
              <Menu className="h-4 w-4" /> {/* Ikon Menu */}
              <span className='text-sm'>Menu</span> {/* Teks "Menu" */}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                id="dropdown"
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a
                      href="/review"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reviewku
                    </a>
                  </li>
                  <li>
                    <a
                      href="/jajananku"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Jajanku
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Link to="/filter" className="flex items-center space-x-1">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter Jajanan</span>
          </Link>
          <a href="/add" className="flex items-center space-x-1">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm">Tambah Jajanan</span>
          </a>
          <a href="/favoritku" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Favoritku</span>
          </a>
        </nav>
      </header>

      <div className="mx-20">
        {/* Hero Section */}
        <a href = '/detailjajanan'>
        <section className="relative h-[400px] w-full rounded-lg mt-6">
          <img
            src={Risol}
            alt="Risoles Mozzarella"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
            <div className="container flex h-full flex-col justify-end px-4 pb-8 text-white rounded-lg">
              <h1 className="text-4xl font-bold rounded-lg">Risoles Mozzarella</h1>
              <p className="mb-4 text-xl rounded-lg">Risolez</p>
              <button className="w-fit bg-[#E1E9DB] text-black hover:bg-[#d4dece] rounded-lg px-4 py-2">
                Lihat Kembali
              </button>
            </div>
          </div>
        </section>
        </a>

        {/* Top Jajanan Section */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">TOP JAJANAN</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Mie Rendang */}
            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-square">
                <img
                  src={Mie}
                  alt="Mie Rendang"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute right-2 top-2 text-white hover:text-white"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Mie Rendang</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.5 (25)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corndog */}
            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-square">
                <img
                  src={Corndog}
                  alt="Corndog"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute right-2 top-2 text-white hover:text-white"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Corndog</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.5 (25)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Es Kelapa */}
            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-square">
                <img
                  src={Kelapa}
                  alt="Es Kelapa Muda"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute right-2 top-2 text-white hover:text-white"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Es Kelapa Muda</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.5 (25)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    );
}

export default Dashboard;
