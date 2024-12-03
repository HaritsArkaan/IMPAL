import React, { useState } from 'react';
import { Menu, Filter, Heart, User, Upload } from 'lucide-react';
import Logo from "../photo/logo.jpg";

function TambahJajanan() {
  const [selectedPrice, setSelectedPrice] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");

  const isFlavorSelectable = selectedType === "Makanan";

  // Dominant color from the uploaded image
  const primaryColor = "rgb(112, 174, 110)";

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <img src={Logo} alt="Snack Hunt Logo" width={100} height={40} />
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2">
            <Menu size={24} />
            <span>Menu</span>
          </button>
          <button className="flex items-center gap-2">
            <Filter size={24} />
            <span>Filter Jajanan</span>
          </button>
          <button className="flex items-center gap-2">
            <Heart size={24} />
            <span>Favoritku</span>
          </button>
        </div>
        <button aria-label="Profile">
          <User size={24} />
        </button>
      </header>

      {/* Main Form */}
      <main>
        <h1
          className="text-3xl font-semibold text-center mb-8"
          style={{ color: primaryColor }}
        >
          Tambah Jajanan
        </h1>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Upload size={48} className="text-gray-400" />
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
            placeholder="Masukkan nama jajanan disini..."
            className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
            maxLength={100}
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block mb-2">Harga Jajanan</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {["5.000", "7.000", "10.000", "15.000"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPrice(price)}
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
              placeholder="Masukkan nominal lain disini..."
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
            />
          )}
        </div>

        {/* Snack Type and Flavor */}
        <div className="mb-6">
          <label className="block mb-2">Jenis Jajanan</label>
          <p className="text-gray-500 text-sm mb-3">Pilih jenis yang menggambarkan jajananmu!</p>
          <div className="flex items-center gap-3">
            {["Makanan", "Minuman"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setSelectedFlavor(""); // Reset flavor if type changes
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

            {/* Flavor selection only if "Makanan" is selected */}
            {isFlavorSelectable && (
              <div className="flex items-center gap-3 ml-4">
                {["Manis", "Asin", "Pedas"].map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedFlavor === flavor
                        ? "bg-green-500 text-white border-green-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2">
            Alamat Jajanan <span className="text-gray-400 text-sm">0/300</span>
          </label>
          <textarea
            id="address"
            placeholder="Masukkan alamat jajanan disini..."
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
            placeholder="Masukkan kontak jajanan disini..."
            className="w-full p-3 rounded-lg bg-green-50 border border-green-100"
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
  );
}

export default TambahJajanan;
