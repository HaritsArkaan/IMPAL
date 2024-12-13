import React from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";

const LoginForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins">
      <div className="bg-white/40 backdrop-blur-[40px] rounded-3xl shadow-lg p-10 w-[28rem] h-auto">
        <form>
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
                placeholder="Nama Pengguna"
                className="w-full bg-[#D1C5C5] rounded-md pl-10 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
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
                placeholder="Kata Sandi"
                className="w-full bg-[#D1C5C5] rounded-md pl-10 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
              />
            </div>
          </div>

          {/* Lupa Kata Sandi (Posisi Kanan) */}
          <div className="flex justify-end text-sm text-gray-500 mb-6">
            <span className="cursor-pointer hover:underline">Lupa kata sandi?</span>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white rounded-md py-2 hover:bg-gray-700 transition"
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
        <button
          type="button"
          className="w-full border border-gray-800 text-gray-800 rounded-md py-2 hover:bg-gray-100 transition"
        >
          Daftar
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
