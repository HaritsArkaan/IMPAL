import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Pencil, Trash2 } from 'lucide-react';
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

  const handleButtonClick = (item) => {
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
    <div className="min-h-screen bg-white">
      <AdminHeader onSearch={handleSearch} />
      <div className="mx-20">
        <div className="flex justify-between items-center my-6">
          <h2 className="text-2xl font-bold text-green-600">Admin Dashboard</h2>
          <button
            onClick={() => navigate('/add')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filteredData.length > 0 ? filteredData.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-square">
                <img
                  src={`${baseURL}${item.image_URL}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onClick={() => handleButtonClick(item)}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {formatRating(reviewsData[item.id]?.averageRating)} ({reviewsData[item.id]?.reviewCount ?? 0})
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Harga: Rp. {item.price}</p>
                  <p className="text-sm text-gray-600">Type: {item.type}</p>
                  <p className="text-sm text-gray-600">Location: {item.location}</p>
                </div>
              </div>
            </div>
          )) : (
            <p className="col-span-3 text-center text-gray-500">No items found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

