import React, { useEffect, useState } from 'react';
import Logo from "../photo/logo.jpg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Menu, Filter, PlusCircle, Heart, Star } from 'lucide-react';
import Header from './Header';

function Dashboard() {
  const [data, setData] = useState([]);
  const [banner, setBanner] = useState({});
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/snacks/get')
      .then(response => {
        console.log(response.data);
        if (response.data.length > 0) {
          setBanner(response.data[0]);
          setData(response.data.slice(1)); // sisanya diambil setelah item pertama
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []); // Dependensi kosong agar hanya dijalankan sekali

  const baseURL = "http://localhost:8080";

  const handleButtonClick = (item) => {
    navigate('/detailjajanan', { state: { item } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-20">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full rounded-lg mt-6" onClick={() => handleButtonClick(banner)}>
          <img
            src={`${baseURL}${banner.image_URL}`}
            alt={banner.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
            <div className="container flex h-full flex-col justify-end px-4 pb-8 text-white rounded-lg">
              <h1 className="text-4xl font-bold rounded-lg">{banner.name}</h1>
              <p className="mb-4 text-xl rounded-lg">{banner.seller}</p>
              <button className="w-fit bg-[#E1E9DB] text-black hover:bg-[#d4dece] rounded-lg px-4 py-2">
                Lihat Kembali
              </button>
            </div>
          </div>
        </section>

        {/* Top Jajanan Section */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">TOP JAJANAN</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.length > 0 && data.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={() => handleButtonClick(item)}>
                <div className="relative aspect-square">
                  <img
                    src={`${baseURL}${item.image_URL}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute right-2 top-2 text-white hover:text-white">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating} (25)</span>
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

export default Dashboard;
