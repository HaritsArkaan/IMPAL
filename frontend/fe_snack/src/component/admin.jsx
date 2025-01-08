import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Pencil, Trash2, Plus } from 'lucide-react';
import AdminHeader from './AdminHeader';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({});
  const navigate = useNavigate();
  const baseURL = "http://localhost:8080";

  useEffect(() => {
    // Verify admin role
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'ADMIN') {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have admin privileges'
        });
        navigate('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
      return;
    }

    // Fetch food items
    setIsLoading(true);
    axios.get(`${baseURL}/api/snacks/get`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.length > 0) {
          setAllData(response.data);
          setFilteredData(response.data);
          
          // Fetch reviews for each item
          response.data.forEach(item => {
            axios.get(`${baseURL}/reviews/statistics/${item.id}`)
              .then(reviewResponse => {
                setReviewsData(prev => ({
                  ...prev,
                  [item.id]: reviewResponse.data
                }));
              })
              .catch(error => {
                console.error(`Error fetching reviews for ${item.name}:`, error);
              });
          });
        }
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch food items'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = allData.filter(item => 
      item.name.toLowerCase().includes(lowercasedQuery) ||
      item.type.toLowerCase().includes(lowercasedQuery) ||
      item.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredData(filtered);
  };

  const handleEdit = (item) => {
    navigate('/editjajanan', { state: { item } });
  };

  const handleDelete = (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const token = Cookies.get('token');
        axios.delete(`${baseURL}/api/snacks/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => {
            setAllData(prevData => prevData.filter(item => item.id !== itemId));
            setFilteredData(prevData => prevData.filter(item => item.id !== itemId));
            Swal.fire(
              "Deleted!",
              "The food item has been deleted.",
              "success"
            );
          })
          .catch(error => {
            console.error('Error deleting item:', error);
            Swal.fire(
              "Error!",
              "Failed to delete the food item.",
              "error"
            );
          });
      }
    });
  };

  const handleViewDetails = (item) => {
    navigate('/detailjajanan', { state: { item } });
  };

  const formatRating = (rating) => {
    if (rating === null || rating === undefined) {
      return "0.0";
    }
    return rating.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader onSearch={handleSearch} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-600">Admin Dashboard</h2>
          <button
            onClick={() => navigate('/add')}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="mr-2" size={20} />
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div 
                className="relative aspect-square cursor-pointer group"
                onClick={() => handleViewDetails(item)}
              >
                <img
                  src={`${baseURL}${item.image_URL}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.seller}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">
                      {formatRating(reviewsData[item.id]?.averageRating)}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({reviewsData[item.id]?.reviewCount ?? 0})
                    </span>
                  </div>
                  <span className="text-green-500 font-semibold">{item.type}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">Price: Rp. {item.price}</p>
                <p className="text-gray-600 text-sm">Location: {item.location}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

