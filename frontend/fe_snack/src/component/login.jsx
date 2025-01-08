import React, { useState } from "react";
import axios from "axios";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import FloatingHomeButton from "./FloatingHomeButton";

const LoginForm = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = input;

    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username dan password diperlukan",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { username, password });
      const token = response.data.token;
      Cookies.set("token", token, { expires: 1 });
      
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      Swal.fire({
        icon: "success",
        title: "Berhasil masuk!",
        text: "Selamat datang kembali!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      if (userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Username atau password salah",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD]">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <FloatingHomeButton />

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md
          transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
          <div className="absolute inset-0 bg-white/40 rounded-3xl backdrop-blur-sm -z-10"></div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Selamat Datang Kembali!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center transition-transform duration-300 group-focus-within:scale-110">
                  <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-green-500" />
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={handleInput}
                  value={input.username}
                  placeholder="Nama Pengguna"
                  className="w-full bg-white/70 rounded-xl pl-10 pr-4 py-3 text-gray-800 
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-all duration-300"
                  required
                />
              </div>

              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center transition-transform duration-300 group-focus-within:scale-110">
                  <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-green-500" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleInput}
                  value={input.password}
                  placeholder="Kata Sandi"
                  className="w-full bg-white/70 rounded-xl pl-10 pr-4 py-3 text-gray-800 
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-all duration-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.username || !input.password}
              className={`w-full rounded-xl py-3 text-white font-medium
                transition-all duration-300 transform hover:translate-y-[-2px]
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg hover:shadow-green-500/30'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                </div>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white/30 px-4 text-sm text-gray-500 absolute">atau</span>
          </div>

          <Link to="/register">
            <button
              type="button"
              className="w-full border-2 border-green-500 text-green-600 rounded-xl py-3 
                hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:translate-y-[-2px]
                shadow-lg hover:shadow-green-500/30"
            >
              Daftar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

