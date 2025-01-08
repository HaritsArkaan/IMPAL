import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Heart, Star, AlertCircle, MapPin, Tag, DollarSign } from 'lucide-react';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

function Favoritku() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [likedItems, setLikedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Silakan login terlebih dahulu");
          setIsLoading(false);
          return;
        }

        const userId = jwtDecode(token).id;

        const response = await axios.get(`${baseURL}/favorities/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favoriteData = response.data;

        const snackDetails = await Promise.all(
          favoriteData.map(async (favorite) => {
            try {
              const [snackResponse, statsResponse] = await Promise.all([
                axios.get(`${baseURL}/api/snacks/get/${favorite.snackId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${baseURL}/reviews/statistics/${favorite.snackId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
              ]);

              return { 
                ...snackResponse.data, 
                rating: statsResponse.data.averageRating, 
                review: statsResponse.data.reviewCount, 
                favoriteId: favorite.id 
              };
            } catch (error) {
              console.error(`Error fetching data for snack ${favorite.snackId}:`, error);
              return null;
            }
          })
        );

        const validSnackDetails = snackDetails.filter(item => item !== null);
        setFavoriteItems(validSnackDetails);
        const initialLikedItems = new Set(validSnackDetails.map((_, index) => index));
        setLikedItems(initialLikedItems);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Gagal memuat data favorit. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleLike = async (index, item) => {
    if (likedItems.has(index)) {
      Swal.fire({
        title: "Hapus dari Favorit?",
        text: `Apakah anda yakin ingin menghapus ${item.name} dari favorit?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#70AE6E",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        background: "#ffffff",
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-semibold',
          confirmButton: 'rounded-lg',
          cancelButton: 'rounded-lg'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = Cookies.get("token");
            if (!token) throw new Error("Authentication required");

            await axios.delete(`${baseURL}/favorities/${item.favoriteId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setLikedItems(prev => {
              const newLikedItems = new Set(prev);
              newLikedItems.delete(index);
              return newLikedItems;
            });

            setFavoriteItems(prev => prev.filter((_, i) => i !== index));

            Swal.fire({
              title: "Berhasil!",
              text: "Jajanan telah dihapus dari favorit.",
              icon: "success",
              confirmButtonColor: "#70AE6E",
              customClass: {
                popup: 'rounded-lg'
              }
            });
          } catch (err) {
            console.error("Error removing favorite:", err);
            Swal.fire({
              title: "Gagal!",
              text: "Gagal menghapus dari favorit. Silakan coba lagi.",
              icon: "error",
              confirmButtonColor: "#EF4444",
              customClass: {
                popup: 'rounded-lg'
              }
            });
          }
        }
      });
    }
  };

  const handleCardClick = (item) => {
    navigate('/detailjajanan', { 
      state: { 
        item,
        isLoggedIn: !!Cookies.get('token')
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#70AE6E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-4xl md:text-5xl font-bold text-[#70AE6E] mb-12"
        >
          Favoritku
        </motion.h1>

        {error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
            <p className="text-gray-600">Silakan coba lagi nanti.</p>
          </div>
        ) : favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Favorit</h2>
            <p className="text-gray-500">Anda belum menambahkan jajanan ke favorit.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {favoriteItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div 
                    className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  >
                    <img
                      src={`${baseURL}${item.image_URL}`}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      className="absolute right-4 top-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 group-hover:scale-110 z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(index, item);
                      }}
                    >
                      <Heart 
                        className={`h-6 w-6 ${
                          likedItems.has(index) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <span className="text-white text-lg font-medium">Lihat Detail</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#70AE6E] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {item.rating.toFixed(1)} ({item.review})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Rp. {item.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm line-clamp-1">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Favoritku;

