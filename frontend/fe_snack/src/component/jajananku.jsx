import React from "react";
import { IconEdit, IconTrash, IconMenu2, IconFilter, IconCirclePlus, IconSearch, IconUserCircle, IconStar } from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { Search, House, Filter, PlusCircle, Heart, Check } from 'lucide-react';
import Logo from "../photo/logo.jpg";
import Corndog from "../photo/corndog.jpg";
import Risol from "../photo/risol.jpg";
import Mie from "../photo/mie-rendang.jpg";
import Kelapa from "../photo/es-kelapa.jpg";

function App() {
  const reviews = [
    { 
      id: 1, 
      name: "Mie Rendang", 
      rating: 4.5, 
      reviews: 25, 
      image: Mie
    },
    { 
      id: 2, 
      name: "Corndog", 
      rating: 4.5, 
      reviews: 25, 
      image: Corndog
    },
    { 
      id: 3, 
      name: "Es Kelapa", 
      rating: 4.5, 
      reviews: 25, 
      image: Kelapa
    },
  ];

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
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
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
            <Link to="/profile">
            <IconUserCircle size={40} stroke={1.5} />
            </Link>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8 px-4 py-2">
          <a href="/dashboard" className="flex items-center space-x-1">
            <House className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </a>
          <Link to ="/filter" className="flex items-center space-x-1">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter Jajanan</span>
          </Link>
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

      {/* Title */}
      <h1 className="text-center text-[40px] font-semibold text-[#70AE6E] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] my-12">
        Jajananku
      </h1>

      {/* Review Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
        {reviews.map((review) => (
          <div key={review.id} className="w-[250px] mx-auto">
            <div className="relative mb-4">
              <img
                src={review.image}
                alt={review.name}
                className="w-full h-[300px] object-cover rounded-[15px]"
              />
              <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#70AE6E] text-white px-4 py-1 rounded-[8px] flex items-center gap-1 text-sm font-medium">
                <IconEdit className="w-4 h-4" />
                Edit Review
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{review.name}</h2>
              <IconTrash className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1">
              <IconStar className="w-5 h-5 fill-[#FFDE32] text-[#FFDE32]" />
              <span className="text-sm text-[#515151] font-light">
                {review.rating} ({review.reviews})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

