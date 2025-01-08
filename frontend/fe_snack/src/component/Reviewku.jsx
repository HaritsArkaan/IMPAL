import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import EditPopup from './editPopup';
import Header from './Header';
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

function ReviewKu() {
  const [data, setData] = useState([]);
  const [popUpEdit, setPopUpEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const baseURL = "http://localhost:8080";
  const token = Cookies.get("token");
  const userId = token ? jwtDecode(token).id : null;

  const handleImageClick = (snack) => {
    navigate('/detailjajanan', { 
      state: { 
        item: snack,
        isLoggedIn: !!token
      } 
    });
  };

  const togglePopUpEdit = (review) => {
    setSelectedReview(review);
    setPopUpEdit(!popUpEdit);
  };

  const handleDelete = async (reviewId, snackName) => {
    Swal.fire({
      title: "Hapus Review?",
      text: `Apakah anda yakin ingin menghapus review untuk ${snackName}?`,
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
          await axios.delete(`${baseURL}/reviews/${reviewId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setData((prevData) => prevData.filter((item) => item.id !== reviewId));

          Swal.fire({
            title: "Berhasil!",
            text: "Review telah dihapus.",
            icon: "success",
            confirmButtonColor: "#70AE6E",
            customClass: {
              popup: 'rounded-lg'
            }
          });
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire({
            title: "Gagal menghapus!",
            text: "Terjadi kesalahan saat menghapus review.",
            icon: "error",
            confirmButtonColor: "#EF4444",
            customClass: {
              popup: 'rounded-lg'
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      setIsLoading(true);
      try {
        const reviewsResponse = await axios.get(`${baseURL}/reviews/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const reviews = reviewsResponse.data;

        const snacksPromises = reviews.map((review) =>
          axios.get(`${baseURL}/api/snacks/get/${review.snackId}`)
        );
        const statsPromises = reviews.map((review) =>
          axios.get(`${baseURL}/reviews/statistics/${review.snackId}`)
        );

        const snacksResponses = await Promise.all(snacksPromises);
        const statsResponses = await Promise.all(statsPromises);

        const combinedData = reviews.map((review, index) => ({
          ...review,
          snack: snacksResponses[index].data,
          stats: statsResponses[index].data,
        }));

        setData(combinedData);
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Gagal memuat data review.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchReviewsAndStats();
    }
  }, [userId, token]);

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
          Reviewku
        </motion.h1>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Review</h2>
            <p className="text-gray-500">Anda belum memberikan review untuk jajanan apapun.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div 
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(item.snack)}
                >
                  <img
                    src={`${baseURL}${item.snack.image_URL}`}
                    alt={item.snack.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Mencegah event click sampai ke parent
                          togglePopUpEdit(item);
                        }}
                        className="bg-[#70AE6E] text-white px-6 py-2 rounded-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#5c9a5a]"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Review
                      </button>
                      <span className="text-white text-sm">Klik untuk melihat detail</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#70AE6E] transition-colors duration-300">
                        {item.snack.name}
                      </h2>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {item.stats.averageRating.toFixed(1)} ({item.stats.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id, item.snack.name)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {item.content}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Rating: {item.rating}/5
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item.snack.type}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {popUpEdit && selectedReview && (
        <EditPopup
          show={popUpEdit}
          onClose={togglePopUpEdit}
          reviewId={selectedReview.id}
          snackId={selectedReview.snack.id}
        />
      )}
    </div>
  );
}

export default ReviewKu;

