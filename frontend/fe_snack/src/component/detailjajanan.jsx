import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trash2 } from 'lucide-react';
import PopUpReview from './popUpReview';
import Header from './Header';
import AdminHeader from './AdminHeader';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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
  const [usernames, setUsernames] = useState({}); // Added state for usernames

  const location = useLocation();
  const { item } = location.state;
  const baseURL = "http://localhost:8080";

  const togglePopUp = () => {
    if (!isLoggedIn) {
      setError('Silakan login terlebih dahulu untuk menambahkan review');
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
        setReview(response.data);
        // Fetch usernames for each review
        response.data.forEach(review => {
          if (review.userId) {
            fetchUsername(review.userId);
          }
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [baseURL, item.id]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(review);

  const fetchUsername = async (userId) => { // Added function to fetch usernames
    try {
      const response = await axios.get(`${baseURL}/users/${userId}`);
      setUsernames(prev => ({
        ...prev,
        [userId]: response.data.username
      }));
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleAddFavorite = async () => {
    if (!isLoggedIn) {
      setError('Silakan login terlebih dahulu untuk menambahkan ke favorit');
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
      } else {
        if (!favoriteId) {
          setError('Favorite ID not found. Unable to delete.');
          return;
        }
        await axios.delete(`${baseURL}/favorities/${favoriteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setIsFavorite(!newFavoriteStatus);
      setError('Gagal mengupdate status favorit. Silakan coba lagi.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (userRole !== 'ADMIN') {
      setError('Hanya admin yang dapat menghapus review.');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      setError('Anda harus login untuk menghapus review.');
      return;
    }

    try {
      await axios.delete(`${baseURL}/reviews/${reviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReview((prevReviews) => prevReviews.filter((rev) => rev.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Gagal menghapus review. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {userRole === 'ADMIN' ? <AdminHeader /> : <Header />}
      <div className="max-w-5xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
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
              {isLoggedIn && userRole !== 'ADMIN' && (
                <button 
                  className={`p-2 rounded-full hover:bg-gray-100 ${isFavorite ? 'text-red-500' : 'text-[#70AE6E]'}`}
                  onClick={handleAddFavorite}
                >
                  <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            {/* Rating Section */}
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
            {isLoggedIn && userRole !== 'ADMIN' && (
              <button
                onClick={togglePopUp}
                className="w-full mt-6 bg-[#70AE6E] text-lg text-white py-2 px-4 rounded-lg hover:bg-transparent hover:text-[#70AE6E] border hover:border-[#70AE6E] transition duration-300"
              >
                Tambahkan Review
              </button>
            )}
            {isLoggedIn && popUp && (
              <PopUpReview show={popUp} onClose={togglePopUp} snackId={item.id || 0} />
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-xl font-bold">Reviews</h2>
          <div className="space-y-4 mt-4">
            {review.map((rev) => (
              <div key={rev.id} className="bg-gray-100 p-4 rounded-lg relative">
                <div className="flex items-center mb-2">
                  <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{usernames[rev.userId] || 'Deleted User'}</h3>
                    <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rev.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    </div>
                  </div>
                  {userRole === 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600">{rev.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

