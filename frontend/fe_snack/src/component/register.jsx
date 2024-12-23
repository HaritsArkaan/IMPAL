import React, { useEffect, useState } from "react";
import { UserIcon, LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const RegisterForm = () => {
  const [input, setInput] = useState({
      username: "",
      password: "",
      email: ""
  });

  const handleInput = (e) => {
      setInput({
          ...input,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      const { username, password, email } = input;
      console.log(input);
      // API call to register user
      axios
          .post("http://localhost:8080/users", { username, password, email })
          .then((response) => {
              console.log(response.data);
              alert("User created successfully");
              navigate("/login");
          })
          .catch((error) => {
              console.error(error);
          });
  };

  const navigate = useNavigate();



  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#FFC3BE] via-[#FFEBD4] to-[#BED1BD] font-poppins">
      {/* Form Container */}
      <div className="bg-white/40 backdrop-blur-[40px] rounded-3xl shadow-lg px-10 py-16 w-[28rem] h-auto">
        <form type="submit">
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
              />
            </div>
          </div>

          {/* Email Pengguna */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="text"
                name="email"
                onChange={handleInput}
                value={input.email}
                placeholder="Email Pengguna"
                className="w-full bg-[#D1C5C5] text-sm rounded-md pl-10 py-3 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
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
                placeholder="Ulangi Kata Sandi"
                className="w-full bg-[#D1C5C5] text-sm rounded-md pl-10 py-3 text-gray-800 focus:outline-none focus:ring focus:ring-pink-300"
              />
            </div>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-black text-white rounded-md py-3 text-sm hover:bg-gray-800 transition"
          >
            Daftar
          </button>
        </form>

        {/* Tulisan "atau masuk dengan" */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <span>atau masuk dengan</span>
        </div>

        {/* Logo Google */}
        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            onClick={() => alert("Login dengan Google")} // Ganti dengan aksi login sebenarnya
            className="text-black text-2xl font-bold cursor-pointer"
            aria-label="Login dengan Google"
          >
            G
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
