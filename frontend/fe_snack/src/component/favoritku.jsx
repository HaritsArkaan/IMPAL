import React, { useState } from 'react';
import Logo from "../photo/logo.jpg";
import Corndog from "../photo/corndog.jpg";
import Mie from "../photo/mie-rendang.jpg";
import Kelapa from "../photo/es-kelapa.jpg";
import { Link } from 'react-router-dom';
import { Search, House, Filter, PlusCircle, Heart, Star } from 'lucide-react';
import {IconUserCircle} from "@tabler/icons-react";

function Favoritku() {
  const favoriteItems = [
    {
      title: "Mie Rendang",
      image: Mie,
      rating: 4.5,
      reviews: 25,
    },
    {
      title: "Corndog",
      image: Corndog,
      rating: 4.5,
      reviews: 25,
    },
    {
      title: "Es Kelapa Muda",
      image: Kelapa,
      rating: 4.5,
      reviews: 25,
    },
  ];

  const initialLikedItems = new Set(favoriteItems.map((_, index) => index));

  const [likedItems, setLikedItems] = useState(initialLikedItems);

  const toggleLike = (index) => {
    setLikedItems((prev) => {
      const newLikedItems = new Set(prev);
      if (newLikedItems.has(index)) {
        newLikedItems.delete(index);
      } else {
        newLikedItems.add(index);
      }
      return newLikedItems;
    });
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
          <a href="/favoritku" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Favoritku</span>
          </a>
        </nav>
      </header>

      <div className="mx-20">
        {/* Favorites Section */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Favoritku</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {favoriteItems.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute right-2 top-2 text-white hover:text-white"
                    onClick={() => toggleLike(index)}
                  >
                    <Heart className={`h-5 w-5 ${likedItems.has(index) ? "fill-current text-red-500" : ""}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating} ({item.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Favoritku;
