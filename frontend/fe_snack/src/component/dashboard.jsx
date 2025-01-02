import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart, Star } from 'lucide-react';
import Header from './Header';

function Dashboard() {
  const [allData, setAllData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({}); // Menyimpan data review untuk setiap jajanan
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:8080/api/snacks/get')
      .then(response => {
        if (response.data.length > 0) {
          setAllData(response.data);
          setBanner(response.data[0]); // Always keep first item as banner
          setFilteredData(response.data); // Initially show all items including banner
          
          // Ambil data review untuk setiap jajanan
          response.data.forEach(item => {
            axios.get(`http://localhost:8080/reviews/statistics/${item.id}`)
              .then(reviewResponse => {
                setReviewsData(prev => ({
                  ...prev,
                  [item.id]: reviewResponse.data
                }));
              })
              .catch(error => {
                console.error(`Error fetching reviews for ${item.name}:`, error);
              });
          });
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!allData.length) return;

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase();

    if (searchQuery) {
      // Search through all items, including the banner
      const matchingItems = allData.filter(item =>
        item.name.toLowerCase().includes(searchQuery) ||
        (item.seller && item.seller.toLowerCase().includes(searchQuery))
      );
      setFilteredData(matchingItems);
    } else {
      // No search query, show all items
      setFilteredData(allData);
    }
  }, [location.search, allData]);

  const baseURL = "http://localhost:8080";

  const handleButtonClick = (item) => {
    navigate('/detailjajanan', { state: { item } });
  };

  // Memperbaiki fungsi formatRating untuk menangani nilai rating yang null atau undefined
  const formatRating = (rating) => {
    if (rating === null || rating === undefined) {
      return "0.0"; // Default ke rating 0.0 jika tidak ada rating
    }
    return rating.toFixed(1); // Format dengan 1 angka di belakang koma
  };

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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-20">
        {/* Hero Section - Always shows first item */}
        {banner && (
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
        )}

        {/* Jajanan Section - Shows filtered results including banner if it matches */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">JAJANAN</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredData.length > 0 ? filteredData.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={() => handleButtonClick(item)}>
                <div className="relative aspect-square">
                  <img
                    src={`${baseURL}${item.image_URL}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {/* Menampilkan rating dan jumlah review dengan format angka satu desimal */}
                      <span className="text-sm">
                        {formatRating(reviewsData[item.id]?.averageRating)} ({reviewsData[item.id]?.reviewCount ?? 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500">No results found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
