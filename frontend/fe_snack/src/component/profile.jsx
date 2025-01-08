import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { RiEmotionHappyLine } from "react-icons/ri";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    id: null,
  });

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      setUserData({
        username: decoded.username,
        id: decoded.id,
      });

      axios
        .get(`http://localhost:8080/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData({
            username: response.data.username,
            id: response.data.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch user data",
          });
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid session",
      });
    }
  }, []);

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        if (!token || !userData.id) {
          Swal.fire("Error!", "You are not logged in.", "error");
          return;
        }

        axios
          .delete(`http://localhost:8080/users/${userData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire("Deleted!", "Your account has been deleted.", "success").then(() => {
              Cookies.remove("token");
              navigate("/");
            });
          })
          .catch((error) => {
            console.error("Error deleting account:", error);
            Swal.fire("Error!", "There was a problem deleting your account.", "error");
          });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins">
      <div className="flex justify-center items-center flex-grow py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-[40px] rounded-[35px] shadow-lg p-8 w-[420px] relative"
        >
          <div className="absolute top-4 left-4">
            <Link to="/dashboard">
              <FaArrowLeft className="text-gray-600 hover:text-gray-800 transition-colors" />
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden"
            >
              <img
                src="/profile.jpg"
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {userData.username || "Loading..."}
            </h2>
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              <RiEmotionHappyLine className="inline-block text-lg text-pink-500" /> Enjoy exploring your snack reviews!
            </p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteAccount}
              className="bg-[#FF887E] hover:bg-[#FF7A6E] text-white font-semibold py-3 px-4 rounded-lg w-full flex items-center justify-center transition-colors"
            >
              <FaTrash className="mr-2" /> Delete Account
            </motion.button>

            <Link to="/dashboard" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FFC3BE] hover:bg-[#FFB1AB] text-gray-800 font-semibold py-3 px-4 rounded-lg w-full transition-colors"
              >
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
