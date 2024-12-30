import React from "react";
import { IconEdit, IconTrash, IconMenu2, IconFilter, IconCirclePlus, IconSearch, IconUserCircle, IconStar } from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { Search, House, Filter, PlusCircle, Heart, Check } from 'lucide-react';
import Logo from "../photo/logo.jpg";
import Corndog from "../photo/corndog.jpg";
import Risol from "../photo/risol.jpg";
import Mie from "../photo/mie-rendang.jpg";
import Kelapa from "../photo/es-kelapa.jpg";
import Header from './Header';

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
      name: "Mie Rendang", 
      rating: 4.5, 
      reviews: 25, 
      image: Mie
    },
    { 
      id: 3, 
      name: "Mie Rendang", 
      rating: 4.5, 
      reviews: 25, 
      image: Mie
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Title */}
      <h1 className="text-center text-[40px] font-semibold text-[#70AE6E] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] my-12">
        Reviewku
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

