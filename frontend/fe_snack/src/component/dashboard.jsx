import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';
import Header from './Header';
import Cookies from 'js-cookie';

function Dashboard() {
  const [allData, setAllData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const baseURL = "http://localhost:8080";

  // Fetch snack data
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/api/snacks/get`)
      .then(response => {
        if (response.data.length > 0) {
          setAllData(response.data);
          setBanner(response.data[0]);
          setFilteredData(response.data);

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
        } else {
          console.warn("No snacks found from API.");
        }
      })
      .catch(error => {
        console.error("Error fetching snacks:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (!allData.length) return;

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    console.log("Search Query:", searchQuery); // Debug log to see the search query

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchingItems = allData.filter(item =>
        item.name.toLowerCase().includes(query)
      );

      console.log("Matching Items:", matchingItems); // Debug log to see matching items

      setFilteredData(matchingItems);
    } else {
      setFilteredData(allData);
    }
  }, [location.search, allData]);

  // Navigate to detail page
  const handleButtonClick = (item) => {
    navigate('/detailjajanan', { 
      state: { 
        item,
        isLoggedIn: !!Cookies.get('token')
      } 
    });
  };

  // Format ratings
  const formatRating = (rating) => {
    if (rating === null || rating === undefined) {
      return "0.0";
    }
    return rating.toFixed(1);
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
        {banner && (
          <section
            className="relative h-[400px] w-full rounded-lg mt-6 cursor-pointer"
            onClick={() => handleButtonClick(banner)}
          >
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

        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">JAJANAN</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleButtonClick(item)}
                >
                  <div className="relative aspect-square">
                    {item.image_URL ? (
                      <img
                        src={`${baseURL}${item.image_URL}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {formatRating(reviewsData[item.id]?.averageRating)} ({reviewsData[item.id]?.reviewCount ?? 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No snacks found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
