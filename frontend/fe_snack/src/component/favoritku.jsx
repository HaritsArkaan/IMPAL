import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
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
        const userId = jwtDecode(token).id;

        // Fetch favorites from API
        const response = await axios.get(`${baseURL}/favorities/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Example response: [{ id: 7, userId: 7, snackId: 5 }]
        const favoriteData = response.data;

        // Fetch snack details for each favorite
        const snackDetails = await Promise.all(
          favoriteData.map(async (favorite) => {
            const snackResponse = await axios.get(`${baseURL}/api/snacks/get/${favorite.snackId}`);
            return { ...snackResponse.data, favoriteId: favorite.id }; // Include favorite ID
          })
        );

        setFavoriteItems(snackDetails);

        // Initialize liked items
        const initialLikedItems = new Set(snackDetails.map((_, index) => index));
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
            // Perform delete operation
            await axios.delete(`${baseURL}/favorities/${item.favoriteId}`, {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` },
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
            setError("Failed to remove favorite. Please try again.");
          }
        }
      });
    } else {
      console.warn("Adding to favorites is not implemented yet.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-20">
        {/* Favorites Section */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Favoritku</h2>
          {favoriteItems.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada jajanan favorit.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {favoriteItems.map((item, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md">
                  <div className="relative aspect-square">
                    <img
                      src={`${baseURL}${item.image_URL}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute right-2 top-2 text-white hover:text-white"
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
                        <span className="text-sm">{item.rating} ({item.reviews || 0})</span>
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
