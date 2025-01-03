import React, { useState } from "react";
import axios from "axios";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = input;

    if (!username || !password) {
      // Show error notification if fields are empty
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username and password are required",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // API call to login user
    axios
      .post("http://localhost:8080/api/auth/login", { username, password })
      .then((response) => {
        console.log(response.data);
        // Set token in cookies
        Cookies.set("token", response.data.token, { expires: 1 });
        
        // Show Toast notification for successful login
        Swal.fire({
          icon: "success",
          title: "Signed in successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Redirect to dashboard
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        // Show Toast notification for failed login
        Swal.fire({
          icon: "error",
          title: "Login failed. Please try again.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins">
      <div className="absolute top-6 left-6">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-100 h-100 object-contain mix-blend-multiply"
        />
      </div>
      <div className="bg-white/40 backdrop-blur-[40px] rounded-3xl shadow-lg p-10 w-[28rem] h-auto">
        <form onSubmit={handleSubmit}>
          {/* Nama Pengguna */}
          <div className="mb-6 pt-14">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Nama Pengguna
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleInput}
                value={input.username}
                placeholder="Nama Pengguna"
                className="w-full bg-[#D1C5C5] rounded-md pl-10 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Kata Sandi */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleInput}
                value={input.password}
                placeholder="Kata Sandi"
                className="w-full bg-[#D1C5C5] rounded-md pl-10 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className={`w-full ${
              !input.username || !input.password
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700'
            } text-white rounded-md py-2 transition text-center items-center justify-center`}
            disabled={!input.username || !input.password}
          >
            Masuk
          </button>
        </form>

        {/* Garis Pemisah */}
        <div className="flex items-center justify-center my-6 text-sm text-gray-400">
          <div className="border-t border-gray-300 w-full" />
          <span className="mx-2">atau</span>
          <div className="border-t border-gray-300 w-full" />
        </div>

        {/* Tombol Daftar */}
        <Link to="/register">
          <button
            type="button"
            className="w-full border border-gray-800 text-gray-800 rounded-md py-2 hover:bg-gray-100 transition"
          >
            Daftar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

