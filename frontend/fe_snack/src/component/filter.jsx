import React, { useState } from 'react';
import { Search, Menu, Filter, PlusCircle, Heart, Check } from 'lucide-react';
import { IconSalad, IconMilkshake, IconPepper, IconMeat, IconLollipop, IconLemon, IconUserCircle } from "@tabler/icons-react";

const FilterButton = ({ icon: Icon, label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-between py-6 px-4 rounded-[30px] border-2 border-green-500 transition-colors relative w-[130px] h-[180px]
      ${isSelected ? 'bg-green-50' : 'bg-white'}`}
  >
    <div className="w-20 h-20 flex items-center justify-center text-green-500">
      <Icon size={48} stroke={1.5} />
    </div>
    <span className="text-base font-medium text-green-500">{label}</span>
    <div className={`w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center`}>
      {isSelected && <Check className="w-4 h-4 text-green-500" />}
    </div>
  </button>
);

function FilterPage() {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <img
            src="/logo.jpg"
            alt="Snack Hunt Logo"
            className="w-[120px] h-[100px] object-contain"
          />
          <div className="flex w-full max-w-md items-center justify-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="mau jajan apa hari ini?"
                className="w-full bg-[#E1E9DB] pr-8 pl-3 py-2 text-center rounded-full"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button 
            className="text-black hover:text-gray-700 rounded-full"
            onClick={() => console.log('User profile clicked')}
          >
            <IconUserCircle size={40} stroke={1.5} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8 px-4 py-2">
          <a href="/" className="flex items-center space-x-1">
            <Menu className="h-4 w-4" />
            <span className="text-sm">Menu</span>
          </a>
          <a href="/add" className="flex items-center space-x-1">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm">Tambah Jajanan</span>
          </a>
          <a href="/favorites" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Favoritku</span>
          </a>
        </nav>
      </header>

      {/* Filter Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-500 mb-12">
          Filter Jajanan
        </h1>

        {/* Main Categories */}
        <div className="flex justify-center gap-6 mb-12">
          <FilterButton
            icon={IconSalad}
            label="Makanan"
            isSelected={selectedFilters.includes('makanan')}
            onClick={() => toggleFilter('makanan')}
          />
          <FilterButton
            icon={IconMilkshake}
            label="Minuman"
            isSelected={selectedFilters.includes('minuman')}
            onClick={() => toggleFilter('minuman')}
          />
        </div>

        {/* Taste Categories */}
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto mb-12">
          <FilterButton
            icon={IconPepper}
            label="Pedas"
            isSelected={selectedFilters.includes('pedas')}
            onClick={() => toggleFilter('pedas')}
          />
          <FilterButton
            icon={IconMeat}
            label="Asin"
            isSelected={selectedFilters.includes('asin')}
            onClick={() => toggleFilter('asin')}
          />
          <FilterButton
            icon={IconLollipop}
            label="Manis"
            isSelected={selectedFilters.includes('manis')}
            onClick={() => toggleFilter('manis')}
          />
          <FilterButton
            icon={IconLemon}
            label="Asam"
            isSelected={selectedFilters.includes('asam')}
            onClick={() => toggleFilter('asam')}
          />
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-full text-lg"
            onClick={() => console.log('Selected filters:', selectedFilters)}
          >
            Cari Jajanan
          </button>
        </div>
      </main>
    </div>
  );
}

export default FilterPage;

