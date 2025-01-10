import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trash2, MapPin, Phone, Tag, DollarSign, Star, AlertCircle, Clock, Store, Mail, ThumbsUp } from 'lucide-react';
import PopUpReview from './popUpReview';
import Header from './Header';
import AdminHeader from './AdminHeader';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function DetailJajanan() {
  const [review, setReview] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);

  const location = useLocation();
  const { item } = location.state;
  const baseURL = "http://localhost:8080";

  const togglePopUp = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menambahkan review',
        icon: 'info',
        confirmButtonColor: '#70AE6E',
        confirmButtonText: 'OK'
      });
      return;
    }
    setPopUp(!popUp);
  };

  const fetchUserFavorites = useCallback(async (token, userId) => {
    if (!token || !userId) return;
    
    try {
      const response = await axios.get(`${baseURL}/favorities/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const favorites = response.data;
      const favorite = favorites.find(fav => fav.snackId === item.id);
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [baseURL, item.id]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        setUserRole(decodedToken.role);
        fetchUserFavorites(token, decodedToken.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setIsLoading(false);
  }, [fetchUserFavorites]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${baseURL}/reviews/snack/${item.id}`);
        if (response.data && Array.isArray(response.data)) {
          const reviewsWithUsernames = await Promise.all(
            response.data.map(async (rev) => {
              try {
                const userResponse = await axios.get(`${baseURL}/users/${rev.userId}`);
                return {
                  ...rev,
                  username: userResponse.data.username,
                  createdAt: new Date().toISOString() // Add timestamp if not provided by API
                };
              } catch (error) {
                console.error(`Error fetching user data for review ${rev.id}:`, error);
                return {
                  ...rev,
                  username: 'Deleted User',
                  createdAt: new Date().toISOString()
                };
              }
            })
          );
          setReview(reviewsWithUsernames);
        } else {
          console.error('Invalid review data format:', response.data);
          setReview([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReview([]);
      }
    };

    fetchReviews();
  }, [baseURL, item.id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(review);

  const handleAddFavorite = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menambahkan ke favorit',
        icon: 'info',
        confirmButtonColor: '#70AE6E',
        confirmButtonText: 'OK'
      });
      return;
    }

    const token = Cookies.get('token');
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      if (newFavoriteStatus) {
        const response = await axios.post(`${baseURL}/favorities`, {
          userId: userId,
          snackId: item.id
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavoriteId(response.data.id);
        Swal.fire({
          title: 'Berhasil',
          text: 'Jajanan berhasil ditambahkan ke favorit',
          icon: 'success',
          confirmButtonColor: '#70AE6E',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        if (!favoriteId) {
          throw new Error('Favorite ID not found');
        }
        await axios.delete(`${baseURL}/favorities/${favoriteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavoriteId(null);
        Swal.fire({
          title: 'Berhasil',
          text: 'Jajanan dihapus dari favorit',
          icon: 'success',
          confirmButtonColor: '#70AE6E',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setIsFavorite(!newFavoriteStatus);
      Swal.fire({
        title: 'Gagal',
        text: 'Gagal mengupdate status favorit. Silakan coba lagi.',
        icon: 'error',
        confirmButtonColor: '#70AE6E'
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (userRole !== 'ADMIN') {
      Swal.fire({
        title: 'Akses Ditolak',
        text: 'Hanya admin yang dapat menghapus review',
        icon: 'error',
        confirmButtonColor: '#70AE6E'
      });
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login untuk menghapus review',
        icon: 'error',
        confirmButtonColor: '#70AE6E'
      });
      return;
    }

    try {
      await Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus review ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#70AE6E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${baseURL}/reviews/${reviewId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setReview((prevReviews) => prevReviews.filter((rev) => rev.id !== reviewId));
          Swal.fire({
            title: 'Berhasil',
            text: 'Review berhasil dihapus',
            icon: 'success',
            confirmButtonColor: '#70AE6E',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      Swal.fire({
        title: 'Gagal',
        text: 'Gagal menghapus review. Silakan coba lagi.',
        icon: 'error',
        confirmButtonColor: '#70AE6E'
      });
    }
  };

  const shareJajanan = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Cek jajanan ${item.name} di SnackHunt!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        Swal.fire({
          title: 'Link Tersalin!',
          text: 'Link jajanan telah disalin ke clipboard',
          icon: 'success',
          confirmButtonColor: '#70AE6E',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {userRole === 'ADMIN' ? <AdminHeader /> : <Header />}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#70AE6E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {userRole === 'ADMIN' ? <AdminHeader /> : <Header />}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl shadow-lg group"
          >
            <img
              src={`${baseURL}${item.image_URL}`}
              alt={item.name}
              className="w-full h-[400px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              onClick={() => setSelectedImage(`${baseURL}${item.image_URL}`)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Image Modal */}
            {selectedImage && (
              <div 
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <img
                  src={selectedImage}
                  alt="Full size"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full justify-between p-6 bg-white rounded-2xl shadow-lg"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
                {isLoggedIn && userRole !== 'ADMIN' && (
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full ${isFavorite ? 'bg-red-50' : 'bg-green-50'} 
                    hover:shadow-md transition-all duration-300`}
                    onClick={handleAddFavorite}
                  >
                    <Heart 
                      className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-[#70AE6E]'}`}
                      fill={isFavorite ? 'currentColor' : 'none'} 
                    />
                  </motion.button>
                )}
              </div>

              {/* Seller Information */}
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#70AE6E]" />
                  Informasi Penjual
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Nama:</span>
                    <span>{item.seller}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Lokasi:</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Kontak:</span>
                    <span>{item.contact}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {averageRating}/5 ({review.length} reviews)
                </span>
                {review.length >= 5 && averageRating > 4 && (
                  <div className="flex items-center gap-2 text-green-500">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">Direkomendasikan</span>
                  </div>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-[#70AE6E]" />
                    <span className="font-medium text-gray-700">Harga</span>
                  </div>
                  <p className="text-[#70AE6E] font-semibold">Rp. {item.price}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Kategori</span>
                  </div>
                  <p className="text-blue-600 font-semibold">{item.type}</p>
                </div>
              </div>
            </div>

            {/* Add Review Button */}
            {isLoggedIn && userRole !== 'ADMIN' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={togglePopUp}
                className="w-full bg-[#70AE6E] text-lg text-white py-3 px-6 rounded-xl
                         hover:bg-[#5c9a5a] shadow-lg hover:shadow-xl
                         transition-all duration-300 transform"
              >
                Tambahkan Review
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
          <div className="space-y-6">
            <AnimatePresence>
              {review.map((rev, index) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl relative group hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#70AE6E] flex items-center justify-center text-white text-lg font-semibold">
                        {(rev.username || 'A')[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {rev.username || 'Anonymous User'}
                        </h3>
                        {userRole === 'ADMIN' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        )}
                      </div>
                      <div className="flex items-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-2">{rev.content}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {review.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Review</h3>
                <p className="text-gray-600">Jadilah yang pertama memberikan review!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {isLoggedIn && popUp && (
        <PopUpReview show={popUp} onClose={togglePopUp} snackId={item.id || 0} />
      )}
    </div>
  );
}

