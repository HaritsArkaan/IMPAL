import React, { useState } from 'react';
import Logo from "../photo/logo.jpg";
import Corndog from "../photo/corndog.jpg";
import Mie from "../photo/mie-rendang.jpg";
import Kelapa from "../photo/es-kelapa.jpg";
import { Link } from 'react-router-dom';
import { Search, House, Filter, PlusCircle, Heart, Star } from 'lucide-react';
import {IconUserCircle} from "@tabler/icons-react";
import Header from './Header';

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
      <Header />

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
