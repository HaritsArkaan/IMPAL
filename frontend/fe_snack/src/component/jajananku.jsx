import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Star, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Header from './Header';
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function JajananKu() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = "http://localhost:8080";
  const token = Cookies.get("token");
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchSnacksAndStats = async () => {
      setIsLoading(true);
      try {
        const snacksResponse = await axios.get(`${baseURL}/api/snacks/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const snacks = snacksResponse.data;

        const statsPromises = snacks.map(snack =>
          axios.get(`${baseURL}/reviews/statistics/${snack.id}`)
        );
        const statsResponses = await Promise.all(statsPromises);

        const combinedData = snacks.map((snack, index) => ({
          ...snack,
          stats: statsResponses[index].data
        }));

        setData(combinedData);
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Gagal memuat data jajanan.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSnacksAndStats();
    }
  }, [userId, token]);

  const handleDelete = (snackId, snackName) => {
    Swal.fire({
      title: "Hapus Jajanan?",
      text: `Apakah anda yakin ingin menghapus ${snackName}?`,
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
          await axios.delete(`${baseURL}/api/snacks/${snackId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setData((prevData) => prevData.filter((item) => item.id !== snackId));
          
          Swal.fire({
            title: "Berhasil!",
            text: "Jajanan telah dihapus.",
            icon: "success",
            confirmButtonColor: "#70AE6E",
            customClass: {
              popup: 'rounded-lg'
            }
          });
        } catch (error) {
          console.error("Error deleting snack:", error);
          Swal.fire({
            title: "Gagal menghapus!",
            text: "Terjadi kesalahan saat menghapus jajanan.",
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

  const handleEdit = (item) => {
    navigate('/editjajanan', { state: { item } });
  };

  const handleCardClick = (item) => {
    navigate('/detailjajanan', { 
      state: { 
        item,
        isLoggedIn: !!token
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#70AE6E]">
            Jajananku
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add')}
            className="bg-[#70AE6E] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#5c9a5a] transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            Tambah Jajanan
          </motion.button>
        </motion.div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Jajanan</h2>
            <p className="text-gray-500 mb-6">Anda belum menambahkan jajanan apapun.</p>
            <button
              onClick={() => navigate('/add')}
              className="bg-[#70AE6E] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5c9a5a] transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
              Tambah Jajanan Sekarang
            </button>
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
                  onClick={() => handleCardClick(item)}
                >
                  <img
                    src={`${baseURL}${item.image_URL}`}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="bg-[#70AE6E] text-white px-6 py-2 rounded-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#5c9a5a]"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Jajanan
                      </button>
                      <span className="text-white text-sm">Klik untuk melihat detail</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#70AE6E] transition-colors duration-300">
                        {item.name}
                      </h2>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {item.stats.averageRating.toFixed(1)} ({item.stats.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.name);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Rp. {item.price}
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item.type}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm line-clamp-1">
                      {item.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default JajananKu;

