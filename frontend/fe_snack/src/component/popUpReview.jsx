import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function PopUpReview({ show, onClose, snackId }) {
  const [selectedPrice, setSelectedPrice] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({
    content: "",
    rating: "",
    snackId: snackId,
    userId: null
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setInput(prev => ({
          ...prev,
          userId: decoded.id
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Terjadi kesalahan saat memverifikasi user");
      }
    }
  }, []);

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
    setInput({
      ...input,
      rating: price
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const token = Cookies.get("token");
    if (!token) {
      setError("Silakan login terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    if (!input.rating) {
      setError("Silakan pilih rating terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    if (!input.content.trim()) {
      setError("Silakan isi review terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/reviews", 
        input,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Gagal menambahkan review. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryColor = "rgb(112, 174, 110)";
  
  if (!show) return null;

  return (
    <div className="flex justify-center items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="mx-auto">
          <main className="box-border p-8 rounded-lg shadow-md border-4 relative" style={{ borderColor: primaryColor }}>
            <h1
              className="text-3xl font-semibold text-center mb-8"
              style={{ color: primaryColor }}
            >
              Tambah Review
            </h1>

            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 top-4 right-4 absolute"
            >
              <X className="w-6 h-6" />
            </button>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Rating */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Rating Jajanan</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {["1", "2", "3", "4", "5"].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => handlePriceSelection(price)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedPrice === price
                        ? "bg-green-500 text-white border-green-500"
                        : "border-gray-300 text-gray-700 hover:border-green-500"
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="mb-6">
              <label htmlFor="review" className="block mb-2 font-medium">
                Review Jajanan{" "}
                <span className="text-gray-400 text-sm">
                  {input.content.length}/300
                </span>
              </label>
              <textarea
                id="review"
                placeholder="Masukkan review jajanan disini..."
                name="content"
                value={input.content}
                onChange={handleInput}
                className="w-full p-3 rounded-lg bg-green-50 border border-green-100 min-h-[100px] focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                maxLength={300}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                className={`px-8 py-3 text-white rounded-lg transition-all ${
                  isSubmitting 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:opacity-90"
                }`}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default PopUpReview;

