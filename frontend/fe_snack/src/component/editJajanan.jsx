import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Upload } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import Header from "./Header";
import AdminHeader from "./AdminHeader";
import axios from "axios";

function EditJajanan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // Untuk preview image

  // Validasi jika tidak ada state item
  useEffect(() => {
    if (!location.state || !location.state.item) {
      console.error("No item data found in location.state");
      navigate("/dashboard"); // Redirect ke halaman dashboard
    }

    // Set initial preview image jika ada
    if (location.state && location.state.item) {
      const { item } = location.state;
      setPreviewImage(item.image_URL ? `http://localhost:8080${item.image_URL}` : "");
    }

    // Check user role
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, [location, navigate]);
  
  // Ambil item dari location.state
  const { item } = location.state || { item: {} };
  const [selectedPrice, setSelectedPrice] = useState(
    ["5000", "7000", "10000", "15000"].includes(String(item.price)) ? String(item.price) : "custom"
  );
  const [customPrice, setCustomPrice] = useState(
    ["5000", "7000", "10000", "15000"].includes(String(item.price)) ? "" : String(item.price)
  );
  
  const [selectedType, setSelectedType] = useState(item.type || "");
  const [input, setInput] = useState({
    name: item.name || "",
    price: item.price || "",
    seller: item.seller || "",
    contact: item.contact || "",
    location: item.location || "",
    rating: item.rating || 0,
    type: item.type || "",
    userId: jwtDecode(Cookies.get("token")).id,
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
    const file = e.target.files[0];
    if (file) {
      setInput({
        ...input,
        image: file,
      });

      // Update preview image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, price, seller, contact, location, rating, type, userId, image } = input;
    if (!name || !price || !seller || !contact || !location || !type || !image) {
      console.error("All fields are required!");
      alert("Please fill in all fields.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", image);
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
            userId,
          },
        }
      );
      console.log("response:", response.data);
      popUpSuccess();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating snack:", error.response?.data || error.message);
      popUpFailed();
    }
  };
  const primaryColor = "rgb(112, 174, 110)";
  return (
    <div className="min-h-screen bg-white">
      {userRole === 'ADMIN' ? <AdminHeader /> : <Header />}
      <div className="max-w-2xl mx-auto p-4">
        {/* Main Form */}
        <main>
          <h1
            className="text-3xl font-semibold text-center mb-8"
            style={{ color: primaryColor }}
          >
            Edit Jajanan
          </h1>
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-w-xs rounded-lg"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.target.src = ""; // Set to default image or leave empty
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4"
              />
              <p className="text-gray-600">Tambahkan foto jajanan disini</p>
            </div>
          </div>
          {/* Snack Name */}
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
                    setInput((prevInput) => ({ ...prevInput, price })); // Set langsung ke input
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
              {["Makanan", "Minuman"].map((type) => (
                <button
                  key={type}
                  name="type"
                  onClick={() => {
                    setSelectedType(type);
                    setInput((prevInput) => ({ ...prevInput, type })); // Set langsung ke input
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
          {/* Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block mb-2">
              Alamat Jajanan <span className="text-gray-400 text-sm">0/300</span>
            </label>
            <textarea
              id="location"
              name="location"
              value={input.location}
              onChange={handleInput}
              placeholder="Masukkan lokasi jajanan disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100 min-h-[100px]"
              maxLength={300}
            />
          </div>
          {/* Seller */}
          <div className="mb-6">
            <label htmlFor="sellerName" className="block mb-2">
            Penjual Jajanan <span className="text-gray-400 text-sm">0/300</span>
            </label>
            <textarea
              id="sellerName"
              name="seller"
              value={input.seller}
              onChange={handleInput}
              placeholder="Masukkan nama penjual disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100 min-h-[100px]"
              maxLength={300}
            />
          </div>
          {/* Contact */}
          <div className="mb-8">
            <label htmlFor="contact" className="block mb-2">
              Kontak Jajanan <span className="text-gray-400 text-sm">0/300</span>
            </label>
            <input
              id="contact"
              type="text"
              name="contact"
              value={input.contact}
              onChange={handleInput}
              placeholder="Masukkan kontak penjual disini..."
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
              maxLength={300}
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