import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';

function Dashboard() {
  const [allData, setAllData] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua'); // Changed default to 'Semua'
  const [reviewsData, setReviewsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const baseURL = "http://localhost:8080";

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/api/snacks/get`)
      .then(response => {
        if (response.data.length > 0) {
          setAllData(response.data);
          
          // Randomly select 5 items for the featured carousel
          const shuffled = [...response.data].sort(() => 0.5 - Math.random());
          setFeaturedItems(shuffled.slice(0, 5));
          
          // Handle search query
          const searchQuery = searchParams.get('search');
          if (searchQuery) {
            const filtered = response.data.filter(item => 
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
          } else {
            setFilteredItems(response.data);
          }

          // Fetch reviews for each item
          response.data.forEach(item => {
            axios
              .get(`${baseURL}/reviews/statistics/${item.id}`)
              .then(reviewResponse => {
                setReviewsData(prev => ({
                  ...prev,
                  [item.id]: reviewResponse.data,
                }));
              })
              .catch(error => {
                console.error(`Error fetching reviews for ${item.name}:`, error);
              });
          });
        }
      })
      .catch(error => {
        console.error("Error fetching snacks:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleButtonClick = useCallback((item) => {
    navigate('/detailjajanan', { 
      state: { 
        item,
        isLoggedIn: false // This will be handled by detailjajanan.jsx
      } 
    });
  }, [navigate]);

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  }, [featuredItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  }, [featuredItems.length]);

  // Filter items based on active category
  const displayedItems = searchParams.get('search') 
    ? filteredItems 
    : activeCategory === 'Semua'
      ? allData
      : allData.filter(item => item.type === activeCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Search Results Message */}
        {searchParams.get('search') && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Hasil pencarian untuk "{searchParams.get('search')}"
              {filteredItems.length === 0 ? (
                <span className="text-red-500 ml-2">tidak ditemukan</span>
              ) : (
                <span className="text-gray-500 ml-2">
                  ({filteredItems.length} item)
                </span>
              )}
            </h2>
          </div>
        )}

        {/* Featured Items Carousel */}
        {!searchParams.get('search') && (
          <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-[400px] w-full">
              {featuredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={`${baseURL}${item.image_URL}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-8 left-8 text-white">
                      <h2 className="text-4xl font-bold mb-2">{item.name}</h2>
                      <p className="text-xl mb-4">{item.seller}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleButtonClick(featuredItems[currentSlide]);
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition duration-300"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition duration-300"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        )}

        {/* Category Tabs */}
        {!searchParams.get('search') && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-white p-1 shadow-md">
              {['Semua', 'Food', 'Drink', 'Dessert', 'Snack'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Snack Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => handleButtonClick(item)}
            >
              <div className="relative aspect-square">
                <img
                  src={`${baseURL}${item.image_URL}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                  Rp {item.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.seller}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">
                      {formatRating(reviewsData[item.id]?.averageRating)}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({reviewsData[item.id]?.reviewCount ?? 0})
                    </span>
                  </div>
                  <span className="text-green-500 font-semibold">{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

