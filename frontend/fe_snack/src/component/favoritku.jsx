import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Heart, Star } from 'lucide-react';
import Header from './Header';

function Favoritku() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [likedItems, setLikedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }

        const userId = jwtDecode(token).id;

        // Fetch favorites from API
        const response = await axios.get(`${baseURL}/favorities/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Example response: [{ id: 7, userId: 7, snackId: 5 }]
        const favoriteData = response.data;

        // Fetch snack details and review statistics
      const snackDetails = await Promise.all(
        favoriteData.map(async (favorite) => {
          try {
            // Fetch snack details
            const snackResponse = await axios.get(`${baseURL}/api/snacks/get/${favorite.snackId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch review statistics
            const statsResponse = await axios.get(`${baseURL}/reviews/statistics/${favorite.snackId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // Merge snack details with review statistics
            return { 
              ...snackResponse.data, 
              rating: statsResponse.data.averageRating, 
              review: statsResponse.data.reviewCount, 
              favoriteId: favorite.id 
            };
          } catch (error) {
            console.error(`Error fetching data for snack ${favorite.snackId}:`, error);
            return null; // Return null for failed requests
          }
        })
      );

        // Filter out any null results from failed requests
        const validSnackDetails = snackDetails.filter(item => item !== null);
        setFavoriteItems(validSnackDetails);

        // Initialize liked items only for valid items
        const initialLikedItems = new Set(validSnackDetails.map((_, index) => index));
        setLikedItems(initialLikedItems);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleLike = async (index) => {
    const item = favoriteItems[index];

    if (likedItems.has(index)) {
      // Show confirmation dialog
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = Cookies.get("token");
            if (!token) {
              throw new Error("Authentication required");
            }

            // Perform delete operation
            await axios.delete(`${baseURL}/favorities/${item.favoriteId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // Update state
            setLikedItems((prev) => {
              const newLikedItems = new Set(prev);
              newLikedItems.delete(index);
              return newLikedItems;
            });

            setFavoriteItems((prev) => prev.filter((_, i) => i !== index));

            // Show success message
            Swal.fire({
              title: "Deleted!",
              text: "Your favorite item has been deleted.",
              icon: "success",
            });
          } catch (err) {
            console.error("Error removing favorite:", err);
            Swal.fire({
              title: "Error!",
              text: "Failed to remove favorite. Please try again.",
              icon: "error",
            });
          }
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Favorites Section */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Favoritku</h2>
          {favoriteItems.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada jajanan favorit.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {favoriteItems.map((item, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
                  <div className="relative aspect-square">
                    <img
                      src={`${baseURL}${item.image_URL}`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      className="absolute right-2 top-2 rounded-full bg-white/50 p-2 text-white hover:bg-white/75"
                      onClick={() => toggleLike(index)}
                    >
                      <Heart className={`h-5 w-5 ${likedItems.has(index) ? "fill-current text-red-500" : ""}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating} ({item.review || 0})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Favoritku;

