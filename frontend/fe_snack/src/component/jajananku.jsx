import React, { useEffect, useState } from "react";
import { IconEdit, IconTrash, IconUserCircle, IconStar } from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Header from './Header';

function App() {
  const [data, setData] = useState([]);
  const baseURL = "http://localhost:8080";
  const userId = jwtDecode(Cookies.get("token")).id;

  useEffect(() => {
    const fetchSnacksAndStats = async () => {
      try {
        const snacksResponse = await axios.get(`${baseURL}/api/snacks/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
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
      }
    };

    fetchSnacksAndStats();
  }, [userId]);

  const handleDelete = async (snackId) => {
    try {
      await axios.delete(`${baseURL}/api/snacks/${snackId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      });
      // Remove the deleted snack from the state
      setData((prevData) => prevData.filter((item) => item.id !== snackId));
      alert("Snack deleted successfully");
    } catch (error) {
      console.error("Error deleting snack:", error);
      alert("Failed to delete snack");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Title */}
      <h1 className="text-center text-[40px] font-semibold text-[#70AE6E] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] my-12">
        Jajananku
      </h1>

      {/* Review Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
        {data.length > 0 && data.map((item) => (
          <div key={item.id} className="w-[250px] mx-auto">
            <div className="relative mb-4">
              <img
                src={`${baseURL}${item.image_URL}`}
                alt={item.name}
                className="w-full h-[300px] object-cover rounded-[15px]"
              />
              <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#70AE6E] text-white px-4 py-1 rounded-[8px] flex items-center gap-1 text-sm font-medium">
                <IconEdit className="w-4 h-4" />
                Edit Jajanan
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{item.name}</h2>
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
    </div>
  );
}

export default App;
