import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, House, Filter, PlusCircle, Heart, Check } from 'lucide-react';
import { IconSalad, IconMilkshake, IconPepper, IconMeat, IconLollipop, IconLemon, IconUserCircle } from "@tabler/icons-react";
import Header from './Header';

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
      <Header />

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

