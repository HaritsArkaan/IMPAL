import React from "react";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins relative">
      {/* Logo - Positioned outside the card */}
      <div className="absolute top-6 left-6">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-100 h-100 object-contain mix-blend-multiply"
        />
      </div>

      {/* Form Container - Centered and Enlarged */}
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-white rounded-[35px] shadow-md p-8 w-[380px] h-[600px] relative flex flex-col">
          {/* Profile Picture */}
          <div className="flex justify-center relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Username */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Username
            </label>
            <div className="bg-[#BED1BD] h-10 rounded-lg"></div>
          </div>

          {/* Buttons */}
          <div className="mt-auto">
            <div className="flex justify-between mb-4">
              <button className="bg-[#A1D69F] hover:bg-green-400 text-black font-semibold py-2 px-4 text-sm rounded-lg">
                Ganti Password
              </button>
              <button className="bg-[#FF887E] hover:bg-red-400 text-black font-semibold py-2 px-4 text-sm rounded-lg">
                Hapus Akun
              </button>
            </div>
            <Link to="/dashboard" className="block w-full">
              <button className="bg-[#FFC3BE] hover:bg-[#FFB1AB] text-black font-semibold py-3 px-4 text-sm rounded-lg w-full">
                Kembali ke Menu
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

