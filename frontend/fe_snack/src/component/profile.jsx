import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

function Profile() {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
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
        const token = Cookies.get("token");
        if (!token) {
          Swal.fire("Error!", "You are not logged in.", "error");
          return;
        }

        const userId = jwtDecode(token).id;

        axios.delete(`http://localhost:8080/users/${userId}`)
          .then(response => {
            Swal.fire(
              "Deleted!",
              "Your account has been deleted.",
              "success"
            ).then(() => {
              // Clear the token from cookies
              Cookies.remove("token");

              // Redirect to the dashboard (login page)
              navigate('/');
            });
          })
          .catch(error => {
            console.error('Error deleting account:', error);
            Swal.fire(
              "Error!",
              "There was a problem deleting your account.",
              "error"
            );
          });
      }
    });
  };

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
              <button
                onClick={handleDeleteAccount}
                className="bg-[#FF887E] hover:bg-red-400 text-black font-semibold py-3 px-4 text-sm rounded-lg w-full"
              >
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

