import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Risol from "../photo/risol.jpg";
import axios from 'axios';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PopUpReview from './popUpReview';
import Header from './Header';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

export default function DetailJajanan() {
  const [review, setReview] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const tooglePopUp = () => {
    setPopUp(!popUp);
  };

  const location = useLocation();
  const { item } = location.state;
  const baseURL = "http://localhost:8080";

  // Mengambil data review dari API
  useEffect(() => {
    axios.get(`http://localhost:8080/reviews/snack/${item.id}`)
      .then(response => {
        setReview(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [item.id]);

  // Menghitung rating rata-rata jika tersedia
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Rata-rata rating dengan 1 angka di belakang koma
  };

  const averageRating = calculateAverageRating(review);

  // Handle add to favorites
  const handleAddFavorite = () => {
    const token = Cookies.get('token');
    if (!token) {
      console.error('No token found. User might not be logged in.');
      return;
    }

    let userId;
    try {
      userId = jwtDecode(Cookies.get("token")).id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return;
    }

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    axios.post(`${baseURL}/favorities`, {
      id: 0,
      userId: userId,
      snackId: item.id
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Favorite status updated:', response.data);
    })
    .catch(error => {
      console.error('Error updating favorite status:', error);
      setIsFavorite(!newFavoriteStatus); // Revert on error
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-5xl mx-auto p-4">
        {/* Food Detail Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <img
              src={`${baseURL}${item.image_URL}`}
              alt={item.name}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{item.name}</h1>
              <button 
                className={`p-2 rounded-full hover:bg-gray-100 ${isFavorite ? 'text-red-500' : 'text-[#70AE6E]'}`}
                onClick={handleAddFavorite}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Rating Section - Display average rating */}
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-500">{averageRating}/5</span>
            </div>

            {/* Price and Tags */}
            <div className="mt-4">
              <span className="text-lg border border-[#70AE6E] mr-2 py-1 px-4 rounded-lg text-[#70AE6E]">
                Rp. {item.price}
              </span>
              <span className="text-lg bg-[#70AE6E] mr-2 py-1 px-4 rounded-lg text-white">
                {item.type}
              </span>
            </div>

            {/* Location and Contact */}
            <div className="mt-4 space-y-2">
              <p className="flex items-center text-[#70AE6E]">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.location}
              </p>
              <p className="flex items-center text-[#70AE6E]">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
                  <path d="M10 16h6" />
                  <path d="M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                </svg>
                {item.contact}
              </p>
            </div>
            <button
              onClick={tooglePopUp}
              className="w-full mt-6 bg-[#70AE6E] text-lg text-white py-2 px-4 rounded-lg hover:bg-transparent hover:text-[#70AE6E] border hover:border-[#70AE6E] transition duration-300"
            >
              Tambahkan Review
            </button>
            <PopUpReview show={popUp} onClose={tooglePopUp} snackId={item.id || 0} />
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-xl font-bold">Reviews</h2>
          <div className="space-y-4 mt-4">
            {review.map((rev) => (
              <div key={rev.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <img
                    src={Risol}
                    alt="Review"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{rev.user}</h3>
                    <div className="flex items-center">
                      {[...Array(rev.rating)].map((_, index) => (
                        <svg
                          key={index}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p>{rev.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

