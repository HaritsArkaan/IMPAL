import React, { useState } from 'react';
import { X } from 'lucide-react';
function PopUpReview({show, onClose}) {
    const [selectedPrice, setSelectedPrice] = useState("");
    
      // Dominant color from the uploaded image
      const primaryColor = "rgb(112, 174, 110)";
      if (!show) {
        return null;
      }
    return (
        <div className="flex justify-center items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg w-1/2">
        <div className="mx-auto">
        <main className="box-border p-8 rounded-lg shadow-md border-4 relative" style={{ borderColor: "rgb(112, 174, 110)" }}>
        <h1
          className="text-3xl font-semibold text-center mb-8"
          style={{ color: primaryColor }}
        >
          Tambah Review
        </h1>

        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 top-1 right-1 absolute">
            <X className="w-6 h-6" />
          </button>

        {/* Price */}
        <div className="mb-6">
          <label className="block mb-2">Rating Jajanan</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {["1", "2", "3", "4", "5"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPrice(price)}
                className={`px-4 py-2 rounded-full border ${
                  selectedPrice === price
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2">
            Review Jajanan <span className="text-gray-400 text-sm">0/300</span>
          </label>
          <textarea
            id="review"
            placeholder="Masukkan review jajanan disini..."
            className="w-full p-3 rounded-lg bg-green-50 border border-green-100 min-h-[100px]"
            maxLength={300}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Simpan
          </button>
        </div>
      </main>
      </div>
        </div>
        </div>
    );
}

export default PopUpReview;