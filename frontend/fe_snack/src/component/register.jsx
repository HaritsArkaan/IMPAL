import React, { useState } from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, role } = input;

    if (!username || !password || !confirmPassword) {
      // Show error notification if fields are empty
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // API call to register user
    axios
      .post("http://localhost:8080/api/auth/register", { username, password, role })
      .then((response) => {
        console.log(response.data);
        
        // Show Toast notification for successful registration
        Swal.fire({
          icon: "success",
          title: "User created successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Redirect to login page
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        
        // Show Toast notification for registration failure
        Swal.fire({
          icon: "error",
          title: error.response?.data || "Registration failed. Please try again.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins">
      <div className="absolute top-6 left-6">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-100 h-100 object-contain mix-blend-multiply"
        />
      </div>
      {/* Form Container */}
      <div className="bg-white/40 backdrop-blur-[40px] rounded-3xl shadow-lg px-10 py-16 w-[28rem] h-auto">
        <form onSubmit={handleSubmit}>
          {/* Nama Pengguna */}
          <div className="mb-6 pt-14">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="text"
                name="username"
                onChange={handleInput}
                value={input.username}
                placeholder="Nama Pengguna"
                className="w-full bg-[#D1C5C5] text-sm rounded-md pl-10 py-3 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Kata Sandi */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="password"
                name="password"
                onChange={handleInput}
                value={input.password}
                placeholder="Kata Sandi"
                className="w-full bg-[#D1C5C5] text-sm rounded-md pl-10 py-3 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Ulangi Kata Sandi */}
          <div className="mb-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleInput}
                value={input.confirmPassword}
                placeholder="Ulangi Kata Sandi"
                className="w-full bg-[#D1C5C5] text-sm rounded-md pl-10 py-3 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className={`w-full ${
              !input.username || !input.password || !input.confirmPassword
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            } text-white rounded-md py-3 text-sm transition`}
            disabled={!input.username || !input.password || !input.confirmPassword}
          >
            Daftar
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
            Sudah punya akun? Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

