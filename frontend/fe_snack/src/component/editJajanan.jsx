import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Upload } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import AdminHeader from "./AdminHeader";
import axios from "axios";

function EditJajanan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [originalUserId, setOriginalUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    setIsAdmin(decodedToken.role === 'ADMIN');

    if (!location.state || !location.state.item) {
      console.error("No item data found in location.state");
      navigate(decodedToken.role === 'ADMIN' ? "/admin" : "/dashboard");
      return;
    }

    const { item } = location.state;
    setOriginalUserId(item.userId);

    if (decodedToken.role !== 'ADMIN' && decodedToken.id !== item.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You do not have permission to edit this item'
      });
      navigate('/dashboard');
    }

    setInput({
      name: item.name || "",
      price: item.price || "",
      seller: item.seller || "",
      contact: item.contact || "",
      location: item.location || "",
      rating: item.rating || 0,
      type: item.type || "",
      userId: item.userId,
      image: "",
    });
    setSelectedPrice(item.price || "");
    setSelectedType(item.type || "");
  }, [location, navigate]);

  const { item } = location.state || { item: {} };

  const [selectedPrice, setSelectedPrice] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [input, setInput] = useState({
    name: "",
    price: "",
    seller: "",
    contact: "",
    location: "",
    rating: 0,
    type: "",
    userId: "",
    image: "",
  });

  const popUpSuccess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Snack Berhasil Diperbarui",
    });
  };

  const popUpFailed = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Snack Gagal Diperbarui",
      text: "Pastikan ukuran file kurang dari 10MB",
    });
  };

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setInput({
      ...input,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, price, seller, contact, location, rating, type, userId, image } = input;

    if (!name || !price || !seller || !contact || !location || !type) {
      console.error("All fields are required!");
      alert("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      if (image) {
        formData.append("file", image);
      }

      const response = await axios.put(
        `http://localhost:8080/api/snacks/${item.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            name,
            price,
            seller,
            contact,
            location,
            rating,
            type,
            userId: originalUserId, // Always use the original userId
          },
        }
      );

      console.log("response:", response.data);
      popUpSuccess();
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Error updating snack:", error.response?.data || error.message);
      popUpFailed();
    }
  };

  const primaryColor = "rgb(112, 174, 110)";

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      <div className="max-w-2xl mx-auto p-4">
        <main>
          <h1
            className="text-3xl font-semibold text-center mb-8"
            style={{ color: primaryColor }}
          >
            Edit Jajanan
          </h1>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Upload size={48} className="text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4"
              />
              <p className="text-gray-600">Tambahkan foto jajanan disini</p>
            </div>
          </div>

          {/* Nama Jajanan */}
          <div className="mb-6">
            <label htmlFor="snackName" className="block mb-2">
              Nama Jajanan <span className="text-gray-400 text-sm">0/100</span>
            </label>
            <input
              id="snackName"
              type="text"
              name="name"
              value={input.name}
              onChange={handleInput}
              placeholder="Masukkan nama jajanan disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
              maxLength={100}
            />
          </div>
          {/* Price */}
          <div className="mb-6">
            <label className="block mb-2">Harga Jajanan</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {["5000", "7000", "10000", "15000"].map((price) => (
                <button
                  key={price}
                  name="price"
                  onClick={() => {
                    setSelectedPrice(price); 
                    setInput((prevInput) => ({ ...prevInput, price }));
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    selectedPrice === price
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  Rp {price}
                </button>
              ))}
              <button
                onClick={() => setSelectedPrice("custom")}
                className={`px-4 py-2 rounded-full border ${
                  selectedPrice === "custom"
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Nominal Lain
              </button>
            </div>
            {selectedPrice === "custom" && (
              <input
                type="text"
                name="price"
                value={customPrice}
                onChange={(e) => {
                  setCustomPrice(e.target.value);
                  setInput({ ...input, price: e.target.value });
                }}
                placeholder="Masukkan nominal lain disini..."
                className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
              />
            )}
          </div>
          {/* Snack Type and Flavor */}
          <div className="mb-6">
            <label className="block mb-2">Jenis Jajanan</label>
            <p className="text-gray-500 text-sm mb-3">Pilih jenis yang menggambarkan jajananmu!</p>
            <div className="flex flex-wrap gap-3">
              {["Manis", "Asin", "Pedas", "Lainnya"].map((type) => (
                <button
                  key={type}
                  name="type"
                  onClick={() => {
                    setSelectedType(type);
                    setInput((prevInput) => ({ ...prevInput, type }));
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    selectedType === type
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Seller Name */}
          <div className="mb-6">
            <label htmlFor="sellerName" className="block mb-2">
              Penjual
            </label>
            <input
              id="sellerName"
              type="text"
              name="seller"
              value={input.seller}
              onChange={handleInput}
              placeholder="Masukkan nama penjual disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
            />
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label htmlFor="contact" className="block mb-2">
              Kontak Penjual
            </label>
            <input
              id="contact"
              type="text"
              name="contact"
              value={input.contact}
              onChange={handleInput}
              placeholder="Masukkan kontak penjual disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block mb-2">
              Lokasi Jajanan
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={input.location}
              onChange={handleInput}
              placeholder="Masukkan lokasi jajanan disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
              Simpan Perubahan
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditJajanan;

