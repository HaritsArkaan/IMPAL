import React, { useEffect, useState } from "react";
import { IconEdit, IconTrash, IconStar } from "@tabler/icons-react";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import EditPopup from './editPopup'; // Pastikan komponen ini diimport dengan benar
import Header from './Header';
import Swal from "sweetalert2";

function App() {
  const [data, setData] = useState([]);
  const [popUpEdit, setPopUpEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const baseURL = "http://localhost:8080";
  const userId = jwtDecode(Cookies.get("token")).id;

  const togglePopUpEdit = (review) => {
    setSelectedReview(review);
    setPopUpEdit(!popUpEdit);
  };

  const handleDelete = async (reviewId) => {
    // Menampilkan SweetAlert untuk konfirmasi penghapusan
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Mengirim request untuk menghapus review berdasarkan reviewId
          await axios.delete(`${baseURL}/reviews/${reviewId}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });

          // Menghapus review yang sudah dihapus dari state
          setData((prevData) => prevData.filter((item) => item.id !== reviewId));

          // Menampilkan SweetAlert konfirmasi penghapusan berhasil
          Swal.fire({
            title: "Deleted!",
            text: "Your review has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.error("Error deleting review:", error);
          // Menampilkan SweetAlert jika ada error dalam penghapusan
          Swal.fire({
            title: "Failed to delete!",
            text: "There was an issue deleting the review.",
            icon: "error"
          });
        }
      }
    });
  };

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        const reviewsResponse = await axios.get(`${baseURL}/reviews/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
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
      }
    };

    fetchReviewsAndStats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <h1 className="text-center text-[40px] font-semibold text-[#70AE6E] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] my-12">
        Reviewku
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
        {data.length > 0 &&
          data.map((item) => (
            <div key={item.id} className="w-[250px] mx-auto">
              <div className="relative mb-4">
                <img
                  src={`${baseURL}${item.snack.image_URL}`}
                  alt={item.snack.name}
                  className="w-full h-[300px] object-cover rounded-[15px]"
                />
                <button
                  onClick={() => togglePopUpEdit(item)}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#70AE6E] text-white px-4 py-1 rounded-[8px] flex items-center gap-1 text-sm font-medium"
                >
                  <IconEdit className="w-4 h-4" />
                  Edit Review
                </button>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{item.snack.name}</h2>
                <button onClick={() => handleDelete(item.id)} className="text-red-500">
                  <IconTrash className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <IconStar className="w-5 h-5 fill-[#FFDE32] text-[#FFDE32]" />
                <span className="text-sm text-[#515151] font-light">
                  {item.stats.averageRating.toFixed(1)} ({item.stats.reviewCount})
                </span>
              </div>
            </div>
          ))}
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

export default App;
