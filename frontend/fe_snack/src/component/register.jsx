import React, { useState } from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import FloatingHomeButton from "./FloatingHomeButton";

const RegisterForm = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, role } = input;

    if (!username || !password || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field harus diisi",
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
        text: "Password tidak cocok",
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
      await axios.post("http://localhost:8080/api/auth/register", { username, password, role });
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun berhasil dibuat",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);
      
      Swal.fire({
        icon: "error",
        title: "Registrasi gagal",
        text: error.response?.data || "Silakan coba lagi",
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
            Buat Akun Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center transition-transform duration-300 group-focus-within:scale-110">
                  <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-green-500" />
                </span>
                <input
                  type="text"
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

              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center transition-transform duration-300 group-focus-within:scale-110">
                  <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-green-500" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleInput}
                  value={input.confirmPassword}
                  placeholder="Ulangi Kata Sandi"
                  className="w-full bg-white/70 rounded-xl pl-10 pr-4 py-3 text-gray-800 
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-all duration-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.username || !input.password || !input.confirmPassword}
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
              ) : 'Daftar'}
            </button>

            <div className="text-center mt-6">
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-300"
              >
                Sudah punya akun? Masuk di sini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

