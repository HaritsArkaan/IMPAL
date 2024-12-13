import React from "react";

function Profile() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-[35px] shadow-md p-6 w-[350px] h-[500px] relative">
        {/* Profile Picture */}
        <div className="flex justify-center relative">
          <div className="w-28 h-28 rounded-full border-4 border-gray-200 overflow-hidden flex items-center justify-center">
            {/* Menggunakan gambar dari public */}
            <img
              src="/profile.png"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          
        </div>

        {/* Username and Email */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold text-lg mb-2 shadowfont-['Poppins']">
            Username
          </label>
          <div className="bg-[#BED1BD] h-8 rounded-xl mb-4"></div>

          <label className="block text-gray-700 font-semibold text-lg mb-2 shadowfont-['Poppins']">
            Email
          </label>
          <div className="bg-[#BED1BD] h-8 rounded-xl mb-6"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between py-14">
          <button className="bg-[#A1D69F] hover:bg-green-400 text-black font-semibold py-2 px-6 rounded-xl shadowfont-['Poppins']">
            Edit Profil
          </button>
          <button className="bg-[#FF887E] hover:bg-red-400 text-black font-semibold py-2 px-6 rounded-xl shadowfont-['Poppins'] ">
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
